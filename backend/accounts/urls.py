from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    UserProfileView,
    AdminDashboardView,
    AdminTeacherListView,
    AdminCreateTeacherView,
    AdminStudentListView, 
    ParentListView, 
    AdminLinkStudentParentView,
    AdminSyncLinksView,
    AdminDeleteUserView, 
    AdminBulkDeleteView, 
    BulkStudentUploadView, 
    BulkParentUploadView,
    BulkTeacherUploadView,
    AdminClassListView,
    AdminCreateClassView,
    ParentDashboardView,
    # --- NEWLY ADDED VIEWS ---
    TeacherDashboardView,    
    TeacherStudentListView,  
    AdminAssignStudentToClassView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # --- Auth & Profile ---
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),

    # --- Dashboards ---
    path('admin-dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('parent-dashboard/', ParentDashboardView.as_view(), name='parent_dashboard'),
    # FIXED: Added the path that was giving the 404 error
    path('teacher-dashboard/', TeacherDashboardView.as_view(), name='teacher_dashboard'),

    # --- Lists & Student Management ---
    path('parents-list/', ParentListView.as_view(), name='parents_list'),
    path('admin/teachers/', AdminTeacherListView.as_view(), name='admin_teachers_list'),
    path('admin/students/', AdminStudentListView.as_view(), name='admin_students_list'),
    # FIXED: Added the path for teachers to view students across their classes
    path('teacher-students/', TeacherStudentListView.as_view(), name='teacher_students'),

    # --- Admin Operations ---
    path('admin/create-teacher/', AdminCreateTeacherView.as_view(), name='admin_create_teacher'),
    path('admin/link-student/', AdminLinkStudentParentView.as_view(), name='admin_link_student'),
    path('admin/sync-links/', AdminSyncLinksView.as_view(), name='admin_sync_links'),
    path('admin/assign-student-class/', AdminAssignStudentToClassView.as_view(), name='admin_assign_student_class'),

    # --- Bulk Uploads ---
    path('admin/bulk-upload-teachers/', BulkTeacherUploadView.as_view(), name='bulk_upload_teachers'),
    path('admin/bulk-upload-students/', BulkStudentUploadView.as_view(), name='bulk_upload_students'),
    path('admin/bulk-upload-parents/', BulkParentUploadView.as_view(), name='bulk_upload_parents'),

    # --- Class Management ---
    path('admin/classes/', AdminClassListView.as_view(), name='admin_classes_list'),
    path('admin/create-class/', AdminCreateClassView.as_view(), name='admin_create_class'),

    # --- User Management (Delete) ---
    path('admin/delete-user/<int:user_id>/', AdminDeleteUserView.as_view(), name='delete_user'),
    path('admin/bulk-delete/', AdminBulkDeleteView.as_view(), name='bulk_delete'),
]