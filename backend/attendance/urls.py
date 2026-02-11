# backend/attendance/urls.py
from django.urls import path
from .views import (
    SubmitAttendanceView, 
    AttendanceReportView, 
    StudentAttendanceStatsView
)

urlpatterns = [
    path('submit/', SubmitAttendanceView.as_view(), name='submit-attendance'),
    path('report/', AttendanceReportView.as_view(), name='attendance-report'),
    path('stats/', StudentAttendanceStatsView.as_view(), name='student-stats'),
]