from django.utils.translation import gettext as _
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_nested.viewsets import NestedViewSetMixin
from rest_framework import status

from .models import (
    Company,
    CompanyReview,
    CompanyUpdateSuggestion,
    ReviewSpamReport,
    CompanyQuestion,
    CompanyAnswer,
)
from .serializers import (
    CompanySerializer,
    SocialLinkSerializer,
    CompanyReviewSerializer,
    CompanyUpdateSuggestionSerializer,
    ReviewSpamReportSerializer,
    CompanyQuestionSerializer,
    CompanyAnswerSerializer,
)
from .permissions import (
    IsCompanyAdminOrReadOnly,
    CanAskQuestionsOrReview,
    CanSubmitSuggestions,
    CanReportSpam,
)


class CompanyViewSet(ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsCompanyAdminOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        company = self.get_object()
        company.view_count += 1
        company.save(update_fields=['view_count'])
        serializer = self.get_serializer(company)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[CanSubmitSuggestions])
    def suggest_update(self, request, pk=None):
        company = self.get_object()
        serializer = CompanyUpdateSuggestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company, suggested_by=request.user.profile)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        company = self.get_object()
        company.followers.add(request.user.profile)
        return Response({'detail': 'Company followed.'})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def followed(self, request):
        followed_companies = request.user.profile.followed_companies.all()
        serializer = self.get_serializer(followed_companies, many=True)
        return Response(serializer.data)

class CompanyReviewViewSet(ModelViewSet):
    queryset = CompanyReview.objects.all()
    serializer_class = CompanyReviewSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[CanReportSpam])
    def report_spam(self, request, pk=None):
        review = self.get_object()
        serializer = ReviewSpamReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(review=review, reporter=request.user.profile)
        return Response(serializer.data)


class CompanyAnswerViewSet(ModelViewSet):
    queryset = CompanyAnswer.objects.all()
    serializer_class = CompanyAnswerSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None):
        answer = self.get_object()
        profile = request.user.profile
        if profile in answer.upvotes.all():
            answer.upvotes.remove(profile)
            return Response({'detail': 'Upvote removed.'}, status=status.HTTP_200_OK)
        else:
            answer.upvotes.add(profile)
            answer.downvotes.remove(profile)  # Remove downvote if present
            return Response({'detail': 'Upvoted successfully.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def downvote(self, request, pk=None):
        answer = self.get_object()
        profile = request.user.profile
        if profile in answer.downvotes.all():
            answer.downvotes.remove(profile)
            return Response({'detail': 'Downvote removed.'}, status=status.HTTP_200_OK)
        else:
            answer.downvotes.add(profile)
            answer.upvotes.remove(profile)  # Remove upvote if present
            return Response({'detail': 'Downvoted successfully.'}, status=status.HTTP_200_OK)


class CompanyQuestionViewSet(ModelViewSet):
    queryset = CompanyQuestion.objects.all()
    serializer_class = CompanyQuestionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def answer(self, request, pk=None):
        question = self.get_object()
        serializer = CompanyAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(question=question, answered_by=request.user.profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None):
        question = self.get_object()
        profile = request.user.profile
        if profile in question.upvotes.all():
            question.upvotes.remove(profile)
            return Response({'detail': 'Upvote removed.'}, status=status.HTTP_200_OK)
        else:
            question.upvotes.add(profile)
            question.downvotes.remove(profile)  # Remove downvote if present
            return Response({'detail': 'Upvoted successfully.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def downvote(self, request, pk=None):
        question = self.get_object()
        profile = request.user.profile
        if profile in question.downvotes.all():
            question.downvotes.remove(profile)
            return Response({'detail': 'Downvote removed.'}, status=status.HTTP_200_OK)
        else:
            question.downvotes.add(profile)
            question.upvotes.remove(profile)  # Remove upvote if present
            return Response({'detail': 'Downvoted successfully.'}, status=status.HTTP_200_OK)
