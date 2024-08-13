from django.utils.translation import gettext as _
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .filters import CompanyFilter, CompanyReviewFilter, CompanyQuestionFilter


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

    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = CompanyFilter
    ordering_fields = ['name', 'view_count', 'company_size']
    ordering = ['name']
    search_fields = ['name', 'industry', 'company_size', 'location']

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
        return Response({'detail': _('Company followed successfully.')}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def followed(self, request):
        followed_companies = request.user.profile.followed_companies.all()
        serializer = self.get_serializer(followed_companies, many=True)
        return Response(serializer.data)

class CompanyReviewViewSet(ModelViewSet):
    queryset = CompanyReview.objects.all()
    serializer_class = CompanyReviewSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = CompanyReviewFilter
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCompanyAdminOrReadOnly]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_context(self):
        return {'request': self.request}

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
    def upvote(self, request, pk=None, company_pk=None, question_pk=None):
        answer = self.get_object()
        profile = request.user.profile
        if profile in answer.upvotes.all():
            answer.upvotes.remove(profile)
            message = _('Upvote removed.')
        else:
            answer.upvotes.add(profile)
            answer.downvotes.remove(profile)  # Ensure a user can't both upvote and downvote
            message = _('Upvoted successfully.')
        answer.save()
        return Response({'detail': message, 'upvote_count': answer.upvote_count, 'downvote_count': answer.downvote_count}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def downvote(self, request, pk=None, company_pk=None, question_pk=None):
        answer = self.get_object()
        profile = request.user.profile
        if profile in answer.downvotes.all():
            answer.downvotes.remove(profile)
            message = _('Downvote removed.')
        else:
            answer.downvotes.add(profile)
            answer.upvotes.remove(profile)  # Ensure a user can't both downvote and upvote
            message = _('Downvoted successfully.')
        answer.save()
        return Response({'detail': message, 'upvote_count': answer.upvote_count, 'downvote_count': answer.downvote_count}, status=status.HTTP_200_OK)


class CompanyQuestionViewSet(ModelViewSet):
    queryset = CompanyQuestion.objects.all()
    serializer_class = CompanyQuestionSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = CompanyQuestionFilter
    ordering_fields = ['upvote_count', 'downvote_count', 'created_at']
    ordering = ['-upvotes']

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsCompanyAdminOrReadOnly]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def answer(self, request, pk=None, company_pk=None):
        question = self.get_object()
        serializer = CompanyAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(question=question, answered_by=request.user.profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upvote(self, request, pk=None, company_pk=None):
        question = self.get_object()
        profile = request.user.profile
        if profile in question.upvotes.all():
            question.upvotes.remove(profile)
            message = _('Upvote removed.')
        else:
            question.upvotes.add(profile)
            question.downvotes.remove(profile)  # Ensure a user can't both upvote and downvote
            message = _('Upvoted successfully.')
        question.save()
        return Response({'detail': message, 'upvote_count': question.upvote_count, 'downvote_count': question.downvote_count}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def downvote(self, request, pk=None, company_pk=None):
        question = self.get_object()
        profile = request.user.profile
        if profile in question.downvotes.all():
            question.downvotes.remove(profile)
            message = _('Downvote removed.')
        else:
            question.downvotes.add(profile)
            question.upvotes.remove(profile)  # Ensure a user can't both downvote and upvote
            message = _('Downvoted successfully.')
        question.save()
        return Response({'detail': message, 'upvote_count': question.upvote_count, 'downvote_count': question.downvote_count}, status=status.HTTP_200_OK)
