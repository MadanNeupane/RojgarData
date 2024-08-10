from django.utils.translation import gettext_lazy as _
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
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
from rest_framework.permissions import IsAuthenticated


class CompanyViewSet(ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsCompanyAdminOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        company = self.get_object()

        # Increment the visit count
        company.visit_count += 1
        company.save(update_fields=['visit_count'])

        serializer = self.get_serializer(company)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[CanSubmitSuggestions])
    def suggest_update(self, request, pk=None):
        company = self.get_object()
        serializer = CompanyUpdateSuggestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company, suggested_by=request.user.profile)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[CanAskQuestionsOrReview])
    def ask_question(self, request, pk=None):
        company = self.get_object()
        serializer = CompanyQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company, asked_by=request.user.profile)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[CanAskQuestionsOrReview])
    def add_review(self, request, pk=None):
        company = self.get_object()
        serializer = CompanyReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company, user=request.user.profile)
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


class CompanyQuestionViewSet(ModelViewSet):
    queryset = CompanyQuestion.objects.all()
    serializer_class = CompanyQuestionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def answer(self, request, pk=None):
        question = self.get_object()
        if question.answered:
            return Response({'detail': _('This question has already been answered.')}, status=400)

        serializer = CompanyAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(question=question, answered_by=request.user.profile)
        question.answered = True
        question.save()
        return Response(serializer.data)

