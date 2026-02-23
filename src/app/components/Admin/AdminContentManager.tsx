import React from "react";
import { useLocation } from "react-router-dom";
import {
  adminPost,
  adminPut,
  adminDelete,
  adminListInstitutions,
  contentListDepartments,
  contentListCourses,
  contentListSubjects,
  contentListSyllabi,
  contentListTopics,
  contentListTopicContent,
  contentUploadTopicFile,
} from "../../hooks/useApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Upload } from "lucide-react";

type ContentTab = "departments" | "courses" | "subjects" | "syllabi" | "topics";

function getContentTabFromPath(pathname: string): ContentTab {
  if (pathname.endsWith("/departments")) return "departments";
  if (pathname.endsWith("/courses")) return "courses";
  if (pathname.endsWith("/subjects")) return "subjects";
  if (pathname.endsWith("/syllabi")) return "syllabi";
  if (pathname.endsWith("/topics")) return "topics";
  return "departments";
}

function toArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (res && typeof res === "object" && Array.isArray((res as any).results)) return (res as any).results;
  return [];
}

export default function AdminContentManager() {
  const { pathname } = useLocation();
  const contentTab = getContentTabFromPath(pathname);
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [courses, setCourses] = React.useState<any[]>([]);
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [syllabi, setSyllabi] = React.useState<any[]>([]);
  const [topics, setTopics] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [deptName, setDeptName] = React.useState("");
  const [deptInstitutionId, setDeptInstitutionId] = React.useState<number | null>(null);
  const [editingDeptId, setEditingDeptId] = React.useState<string | null>(null);
  const [editingDeptName, setEditingDeptName] = React.useState("");
  const [editingDeptInstitutionId, setEditingDeptInstitutionId] = React.useState<number | null>(null);
  const [showDeptModal, setShowDeptModal] = React.useState(false);

  const [uploadingTopicId, setUploadingTopicId] = React.useState<string | null>(null);
  const [topicContentMap, setTopicContentMap] = React.useState<Record<string, any[]>>({});
  const [institutions, setInstitutions] = React.useState<any[]>([]);

  const [courseName, setCourseName] = React.useState("");
  const [courseDepartmentId, setCourseDepartmentId] = React.useState<string | null>(null);
  const [courseInstitutionFilter, setCourseInstitutionFilter] = React.useState<number | null>(null);
  const [editingCourse, setEditingCourse] = React.useState<any | null>(null);
  const [editingCourseDepartmentId, setEditingCourseDepartmentId] = React.useState<string | null>(null);
  const [showCourseModal, setShowCourseModal] = React.useState(false);

  const [subjectName, setSubjectName] = React.useState("");
  const [subjectCourseId, setSubjectCourseId] = React.useState<string | null>(null);
  const [subjectDepartmentFilter, setSubjectDepartmentFilter] = React.useState<string | null>(null);
  const [editingSubjectId, setEditingSubjectId] = React.useState<string | null>(null);
  const [editingSubjectName, setEditingSubjectName] = React.useState("");
  const [editingSubjectCourseId, setEditingSubjectCourseId] = React.useState<string | null>(null);
  const [showSubjectModal, setShowSubjectModal] = React.useState(false);

  const [syllabusUnitName, setSyllabusUnitName] = React.useState("");
  const [syllabusSubjectId, setSyllabusSubjectId] = React.useState<string | null>(null);
  const [editingSyllabusId, setEditingSyllabusId] = React.useState<string | null>(null);
  const [editingSyllabusUnitName, setEditingSyllabusUnitName] = React.useState("");
  const [editingSyllabusSubjectId, setEditingSyllabusSubjectId] = React.useState<string | null>(null);
  const [showSyllabusModal, setShowSyllabusModal] = React.useState(false);

  const [topicName, setTopicName] = React.useState("");
  const [topicSyllabusId, setTopicSyllabusId] = React.useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = React.useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = React.useState("");
  const [editingTopicSyllabusId, setEditingTopicSyllabusId] = React.useState<string | null>(null);
  const [showTopicModal, setShowTopicModal] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<{ type: string; id: string } | null>(null);
  const [deptFilterInstitutionId, setDeptFilterInstitutionId] = React.useState<number | null>(null);
  const [courseFilterDepartmentId, setCourseFilterDepartmentId] = React.useState<string | null>(null);

  const loadAll = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [inst, d, c, s, sy, t] = await Promise.all([
        adminListInstitutions().catch(() => []),
        contentListDepartments(),
        contentListCourses(),
        contentListSubjects(),
        contentListSyllabi(),
        contentListTopics(),
      ]);
      setInstitutions(Array.isArray(inst) ? inst : (inst?.results ?? []));
      setDepartments(toArray(d));
      setCourses(toArray(c));
      setSubjects(toArray(s));
      setSyllabi(toArray(sy));
      setTopics(toArray(t));
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to load content");
      setDepartments([]);
      setCourses([]);
      setSubjects([]);
      setSyllabi([]);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTopicContent = React.useCallback(async (topicId: string) => {
    try {
      const list = await contentListTopicContent(topicId);
      setTopicContentMap((prev) => ({ ...prev, [topicId]: Array.isArray(list) ? list : [] }));
    } catch {
      setTopicContentMap((prev) => ({ ...prev, [topicId]: [] }));
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  React.useEffect(() => {
    if (contentTab === "topics" && topics.length > 0) {
      topics.forEach((t) => loadTopicContent(t.topic_id));
    }
  }, [contentTab, topics, loadTopicContent]);

  const createDepartment = async () => {
    if (!deptName.trim()) return;
    await adminPost("/content/departments", { name: deptName.trim(), institution_id: deptInstitutionId, slug: deptName.trim().toLowerCase().replace(/\s+/g, "-") });
    setDeptName("");
    setDeptInstitutionId(null);
    setShowDeptModal(false);
    await loadAll();
  };

  const saveDepartment = async () => {
    if (!editingDeptId) return;
    await adminPut(`/content/departments/${editingDeptId}`, { name: editingDeptName.trim(), institution_id: editingDeptInstitutionId, slug: editingDeptName.trim().toLowerCase().replace(/\s+/g, "-") });
    setEditingDeptId(null);
    setEditingDeptName("");
    setEditingDeptInstitutionId(null);
    await loadAll();
  };

  const deleteDepartment = async (id: string) => {
    await adminDelete(`/content/departments/${id}`);
    setDeleteTarget(null);
    await loadAll();
  };

  const createCourse = async () => {
    if (!courseName.trim()) return;
    await adminPost("/content/courses", { course_name: courseName.trim(), department_id: courseDepartmentId || null });
    setCourseName("");
    setCourseDepartmentId(null);
    setShowCourseModal(false);
    await loadAll();
  };

  const saveCourse = async () => {
    if (!editingCourse) return;
    await adminPut(`/content/courses/${editingCourse.course_id}`, { course_name: courseName.trim(), department_id: editingCourseDepartmentId || null });
    setEditingCourse(null);
    setCourseName("");
    setEditingCourseDepartmentId(null);
    await loadAll();
  };

  const deleteCourse = async (id: string) => {
    await adminDelete(`/content/courses/${id}`);
    setDeleteTarget(null);
    await loadAll();
  };

  const createSubject = async () => {
    if (!subjectName.trim() || !subjectCourseId) return;
    await adminPost("/content/subjects", { course_id: subjectCourseId, subject_name: subjectName.trim(), semester: 1 });
    setSubjectName("");
    setSubjectCourseId(null);
    setShowSubjectModal(false);
    await loadAll();
  };

  const saveSubject = async () => {
    if (!editingSubjectId || !editingSubjectCourseId) return;
    await adminPut(`/content/subjects/${editingSubjectId}`, {
      course_id: editingSubjectCourseId,
      subject_name: editingSubjectName.trim(),
      semester: 1,
    });
    setEditingSubjectId(null);
    setEditingSubjectName("");
    setEditingSubjectCourseId(null);
    await loadAll();
  };

  const deleteSubject = async (id: string) => {
    await adminDelete(`/content/subjects/${id}`);
    setDeleteTarget(null);
    await loadAll();
  };

  const createSyllabus = async () => {
    if (!syllabusUnitName.trim() || !syllabusSubjectId) return;
    await adminPost("/content/syllabi", { subject_id: syllabusSubjectId, unit_name: syllabusUnitName.trim(), unit_order: 1 });
    setSyllabusUnitName("");
    setSyllabusSubjectId(null);
    setShowSyllabusModal(false);
    await loadAll();
  };

  const saveSyllabus = async () => {
    if (!editingSyllabusId || !editingSyllabusSubjectId) return;
    await adminPut(`/content/syllabi/${editingSyllabusId}`, {
      subject_id: editingSyllabusSubjectId,
      unit_name: editingSyllabusUnitName.trim(),
      unit_order: 1,
    });
    setEditingSyllabusId(null);
    setEditingSyllabusUnitName("");
    setEditingSyllabusSubjectId(null);
    await loadAll();
  };

  const createTopic = async () => {
    if (!topicName.trim() || !topicSyllabusId) return;
    await adminPost("/content/topics", { syllabus_id: topicSyllabusId, topic_name: topicName.trim() });
    setTopicName("");
    setTopicSyllabusId(null);
    setShowTopicModal(false);
    await loadAll();
  };

  const saveTopic = async () => {
    if (!editingTopicId || !editingTopicSyllabusId) return;
    await adminPut(`/content/topics/${editingTopicId}`, {
      syllabus_id: editingTopicSyllabusId,
      topic_name: editingTopicName.trim(),
      description: "",
    });
    setEditingTopicId(null);
    setEditingTopicName("");
    setEditingTopicSyllabusId(null);
    await loadAll();
  };

  const deleteSyllabus = async (id: string) => {
    await adminDelete(`/content/syllabi/${id}`);
    setDeleteTarget(null);
    await loadAll();
  };

  const deleteTopic = async (id: string) => {
    await adminDelete(`/content/topics/${id}`);
    setDeleteTarget(null);
    await loadAll();
  };

  const handleUploadTopicFile = async (topicId: string, file: File) => {
    const ext = file.name.toLowerCase().split(".").pop();
    if (!["pdf", "csv", "docx"].includes(ext || "")) {
      setError("Only PDF, CSV, and DOCX files are supported.");
      return;
    }
    setUploadingTopicId(topicId);
    setError(null);
    try {
      await contentUploadTopicFile(topicId, file);
      await loadTopicContent(topicId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingTopicId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "department") await deleteDepartment(deleteTarget.id);
    else if (deleteTarget.type === "course") await deleteCourse(deleteTarget.id);
    else if (deleteTarget.type === "subject") await deleteSubject(deleteTarget.id);
    else if (deleteTarget.type === "syllabus") await deleteSyllabus(deleteTarget.id);
    else if (deleteTarget.type === "topic") await deleteTopic(deleteTarget.id);
  };

  const getDepartmentName = (id: string) => departments.find((d) => d.department_id === id)?.name ?? "-";
  const getCourseName = (id: string) => courses.find((c) => c.course_id === id)?.course_name ?? "-";
  const getSubjectName = (id: string) => subjects.find((s) => s.subject_id === id)?.subject_name ?? "-";
  const getSyllabusName = (id: string) => syllabi.find((sy) => sy.syllabus_id === id)?.unit_name ?? "-";

  const filteredDepartments = deptFilterInstitutionId != null
    ? departments.filter((d) => d.institution_id === deptFilterInstitutionId)
    : departments;
  const filteredCourses = courseFilterDepartmentId
    ? courses.filter((c) => c.department_id === courseFilterDepartmentId)
    : courses;

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="size-4" aria-hidden />
          <AlertTitle>Error loading content</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => { setError(null); loadAll(); }}>
            Retry
          </Button>
        </Alert>
      )}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
      <>
      {contentTab === "departments" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Departments</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="dept-filter-institution" className="text-sm text-muted-foreground">Filter by institution</Label>
                <Select value={deptFilterInstitutionId?.toString() ?? "__all__"} onValueChange={(v) => setDeptFilterInstitutionId(v === "__all__" ? null : parseInt(v, 10))}>
                  <SelectTrigger id="dept-filter-institution" className="w-[200px]">
                    <SelectValue placeholder="All institutions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All institutions</SelectItem>
                    {institutions.map((i) => (
                      <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => { setEditingDeptId(null); setDeptName(""); setDeptInstitutionId(null); setShowDeptModal(true); }}>
              Add Department
            </Button>
          </div>
          <Dialog open={showDeptModal || !!editingDeptId} onOpenChange={(open) => { if (!open) { setShowDeptModal(false); setEditingDeptId(null); setDeptName(""); setDeptInstitutionId(null); } }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingDeptId ? "Edit Department" : "Add Department"}</DialogTitle>
                <DialogDescription>{editingDeptId ? "Update the department." : "Enter the department name and institution."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dept-institution">Institution (optional)</Label>
                  <Select value={(editingDeptId ? editingDeptInstitutionId : deptInstitutionId)?.toString() ?? "__none__"} onValueChange={(v) => { const n = v === "__none__" ? null : parseInt(v, 10); editingDeptId ? setEditingDeptInstitutionId(n) : setDeptInstitutionId(n); }}>
                    <SelectTrigger id="dept-institution">
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {institutions.map((i) => (
                        <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept-name">Department name</Label>
                  <Input
                    id="dept-name"
                    value={editingDeptId ? editingDeptName : deptName}
                    onChange={(e) => editingDeptId ? setEditingDeptName(e.target.value) : setDeptName(e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowDeptModal(false); setEditingDeptId(null); setDeptName(""); setDeptInstitutionId(null); }}>Cancel</Button>
                <Button onClick={editingDeptId ? saveDepartment : createDepartment} disabled={!(editingDeptId ? editingDeptName : deptName).trim()}>
                  {editingDeptId ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">ID</TableHead>
                  <TableHead scope="col">Name</TableHead>
                  <TableHead scope="col">Institution</TableHead>
                  <TableHead scope="col" className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No departments found.</TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((d) => (
                    <TableRow key={d.department_id}>
                      <TableCell className="font-mono text-sm">{d.department_id}</TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{institutions.find((i) => i.id === d.institution_id)?.name ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => { setEditingDeptId(d.department_id); setEditingDeptName(d.name); setEditingDeptInstitutionId(d.institution_id); }} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget({ type: "department", id: d.department_id })}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {contentTab === "courses" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Courses</h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="course-filter-department" className="text-sm text-muted-foreground">Filter by department</Label>
                <Select value={courseFilterDepartmentId ?? "__all__"} onValueChange={(v) => setCourseFilterDepartmentId(v === "__all__" ? null : v)}>
                  <SelectTrigger id="course-filter-department" className="w-[200px]">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.department_id} value={d.department_id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => { setEditingCourse(null); setCourseName(""); setCourseDepartmentId(null); setShowCourseModal(true); }}>
              Add Course
            </Button>
          </div>
          <Dialog open={showCourseModal || !!editingCourse} onOpenChange={(open) => { if (!open) { setShowCourseModal(false); setEditingCourse(null); setCourseName(""); setCourseDepartmentId(null); setCourseInstitutionFilter(null); setEditingCourseDepartmentId(null); } }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCourse ? "Edit Course" : "Add Course"}</DialogTitle>
                <DialogDescription>{editingCourse ? "Update the course." : "Enter the course name and department."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {!editingCourse && (
                  <div className="space-y-2">
                    <Label htmlFor="course-institution-filter">Filter departments by institution (optional)</Label>
                    <Select value={courseInstitutionFilter?.toString() ?? "__all__"} onValueChange={(v) => { setCourseInstitutionFilter(v === "__all__" ? null : parseInt(v, 10)); setCourseDepartmentId(null); }}>
                      <SelectTrigger id="course-institution-filter">
                        <SelectValue placeholder="All institutions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All institutions</SelectItem>
                        {institutions.map((i) => (
                          <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="course-department">Department (optional)</Label>
                  <Select value={(editingCourse ? editingCourseDepartmentId : courseDepartmentId) ?? "__none__"} onValueChange={(v) => editingCourse ? setEditingCourseDepartmentId(v === "__none__" ? null : v) : setCourseDepartmentId(v === "__none__" ? null : v)}>
                    <SelectTrigger id="course-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {(courseInstitutionFilter != null ? departments.filter((d) => d.institution_id === courseInstitutionFilter) : departments).map((d) => (
                        <SelectItem key={d.department_id} value={d.department_id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-name">Course name</Label>
                  <Input
                    id="course-name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Course name"
                    onKeyDown={(e) => e.key === "Enter" && (editingCourse ? saveCourse() : createCourse())}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setEditingCourse(null); setCourseName(""); }}>Cancel</Button>
                <Button onClick={editingCourse ? saveCourse : createCourse} disabled={!courseName.trim()}>
                  {editingCourse ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">ID</TableHead>
                  <TableHead scope="col">Name</TableHead>
                  <TableHead scope="col">Department</TableHead>
                  <TableHead scope="col" className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No courses found.</TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((c) => (
                    <TableRow key={c.course_id}>
                      <TableCell className="font-mono text-sm">{c.course_id}</TableCell>
                      <TableCell>{c.course_name}</TableCell>
                      <TableCell>{getDepartmentName(c.department_id ?? "")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => { setEditingCourse(c); setCourseName(c.course_name); setEditingCourseDepartmentId(c.department_id ?? null); }} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget({ type: "course", id: c.course_id })}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {contentTab === "subjects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Subjects</h2>
            <Button onClick={() => { setEditingSubjectId(null); setEditingSubjectName(""); setEditingSubjectCourseId(null); setSubjectName(""); setSubjectCourseId(null); setShowSubjectModal(true); }}>
              Add Subject
            </Button>
          </div>
          <Dialog open={showSubjectModal || !!editingSubjectId} onOpenChange={(open) => { if (!open) { setShowSubjectModal(false); setEditingSubjectId(null); setEditingSubjectName(""); setEditingSubjectCourseId(null); setSubjectName(""); setSubjectCourseId(null); setSubjectDepartmentFilter(null); } }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingSubjectId ? "Edit Subject" : "Add Subject"}</DialogTitle>
                <DialogDescription>{editingSubjectId ? "Update the subject details." : "Enter the subject name and course."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {!editingSubjectId && (
                  <div className="space-y-2">
                    <Label htmlFor="subject-department-filter">Filter courses by department (optional)</Label>
                    <Select value={subjectDepartmentFilter ?? "__all__"} onValueChange={(v) => { setSubjectDepartmentFilter(v === "__all__" ? null : v); setSubjectCourseId(null); }}>
                      <SelectTrigger id="subject-department-filter">
                        <SelectValue placeholder="All departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All departments</SelectItem>
                        {departments.map((d) => (
                          <SelectItem key={d.department_id} value={d.department_id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="subject-course">Course</Label>
                  <Select value={(editingSubjectId ? editingSubjectCourseId : subjectCourseId) ?? ""} onValueChange={(v) => editingSubjectId ? setEditingSubjectCourseId(v || null) : setSubjectCourseId(v || null)}>
                    <SelectTrigger id="subject-course">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {(subjectDepartmentFilter ? courses.filter((c) => c.department_id === subjectDepartmentFilter) : courses).map((c) => (
                        <SelectItem key={c.course_id} value={c.course_id}>{c.course_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Subject name</Label>
                  <Input
                    id="subject-name"
                    value={editingSubjectId ? editingSubjectName : subjectName}
                    onChange={(e) => editingSubjectId ? setEditingSubjectName(e.target.value) : setSubjectName(e.target.value)}
                    placeholder="Subject name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowSubjectModal(false); setEditingSubjectId(null); setEditingSubjectName(""); setEditingSubjectCourseId(null); setSubjectName(""); setSubjectCourseId(null); setSubjectDepartmentFilter(null); }}>Cancel</Button>
                <Button onClick={editingSubjectId ? saveSubject : createSubject} disabled={!(editingSubjectId ? editingSubjectName : subjectName).trim() || !(editingSubjectId ? editingSubjectCourseId : subjectCourseId)}>
                  {editingSubjectId ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">ID</TableHead>
                  <TableHead scope="col">Name</TableHead>
                  <TableHead scope="col">Course</TableHead>
                  <TableHead scope="col" className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No subjects found.</TableCell>
                  </TableRow>
                ) : (
                  subjects.map((s) => (
                    <TableRow key={s.subject_id}>
                      <TableCell className="font-mono text-sm">{s.subject_id}</TableCell>
                      <TableCell>{s.subject_name}</TableCell>
                      <TableCell>{getCourseName(s.course_id)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => { setEditingSubjectId(s.subject_id); setEditingSubjectName(s.subject_name); setEditingSubjectCourseId(s.course_id); }} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget({ type: "subject", id: s.subject_id })}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {contentTab === "syllabi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Syllabi</h2>
            <Button onClick={() => { setEditingSyllabusId(null); setEditingSyllabusUnitName(""); setEditingSyllabusSubjectId(null); setSyllabusUnitName(""); setSyllabusSubjectId(null); setShowSyllabusModal(true); }}>
              Add Syllabus
            </Button>
          </div>
          <Dialog open={showSyllabusModal || !!editingSyllabusId} onOpenChange={(open) => { if (!open) { setShowSyllabusModal(false); setEditingSyllabusId(null); setEditingSyllabusUnitName(""); setEditingSyllabusSubjectId(null); setSyllabusUnitName(""); setSyllabusSubjectId(null); } }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingSyllabusId ? "Edit Syllabus" : "Add Syllabus"}</DialogTitle>
                <DialogDescription>{editingSyllabusId ? "Update the syllabus unit." : "Enter the unit name and subject."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="syllabus-subject">Subject</Label>
                  <Select value={(editingSyllabusId ? editingSyllabusSubjectId : syllabusSubjectId) ?? ""} onValueChange={(v) => editingSyllabusId ? setEditingSyllabusSubjectId(v || null) : setSyllabusSubjectId(v || null)}>
                    <SelectTrigger id="syllabus-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.subject_id} value={s.subject_id}>{s.subject_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="syllabus-unit">Unit name</Label>
                  <Input
                    id="syllabus-unit"
                    value={editingSyllabusId ? editingSyllabusUnitName : syllabusUnitName}
                    onChange={(e) => editingSyllabusId ? setEditingSyllabusUnitName(e.target.value) : setSyllabusUnitName(e.target.value)}
                    placeholder="Unit name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowSyllabusModal(false); setEditingSyllabusId(null); setEditingSyllabusUnitName(""); setEditingSyllabusSubjectId(null); setSyllabusUnitName(""); setSyllabusSubjectId(null); }}>Cancel</Button>
                <Button onClick={editingSyllabusId ? saveSyllabus : createSyllabus} disabled={!(editingSyllabusId ? editingSyllabusUnitName : syllabusUnitName).trim() || !(editingSyllabusId ? editingSyllabusSubjectId : syllabusSubjectId)}>
                  {editingSyllabusId ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">ID</TableHead>
                  <TableHead scope="col">Unit</TableHead>
                  <TableHead scope="col">Subject</TableHead>
                  <TableHead scope="col" className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syllabi.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No syllabi found.</TableCell>
                  </TableRow>
                ) : (
                  syllabi.map((sy) => (
                    <TableRow key={sy.syllabus_id}>
                      <TableCell className="font-mono text-sm">{sy.syllabus_id}</TableCell>
                      <TableCell>{sy.unit_name}</TableCell>
                      <TableCell>{getSubjectName(sy.subject_id)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => { setEditingSyllabusId(sy.syllabus_id); setEditingSyllabusUnitName(sy.unit_name); setEditingSyllabusSubjectId(sy.subject_id); }} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget({ type: "syllabus", id: sy.syllabus_id })}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {contentTab === "topics" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Topics</h2>
            <Button onClick={() => { setEditingTopicId(null); setEditingTopicName(""); setEditingTopicSyllabusId(null); setTopicName(""); setTopicSyllabusId(null); setShowTopicModal(true); }}>
              Add Topic
            </Button>
          </div>
          <Dialog open={showTopicModal || !!editingTopicId} onOpenChange={(open) => { if (!open) { setShowTopicModal(false); setEditingTopicId(null); setEditingTopicName(""); setEditingTopicSyllabusId(null); setTopicName(""); setTopicSyllabusId(null); } }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingTopicId ? "Edit Topic" : "Add Topic"}</DialogTitle>
                <DialogDescription>{editingTopicId ? "Update the topic details." : "Enter the topic name and syllabus."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-syllabus">Syllabus</Label>
                  <Select value={(editingTopicId ? editingTopicSyllabusId : topicSyllabusId) ?? ""} onValueChange={(v) => editingTopicId ? setEditingTopicSyllabusId(v || null) : setTopicSyllabusId(v || null)}>
                    <SelectTrigger id="topic-syllabus">
                      <SelectValue placeholder="Select syllabus" />
                    </SelectTrigger>
                    <SelectContent>
                      {syllabi.map((sy) => (
                        <SelectItem key={sy.syllabus_id} value={sy.syllabus_id}>{sy.unit_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-name">Topic name</Label>
                  <Input
                    id="topic-name"
                    value={editingTopicId ? editingTopicName : topicName}
                    onChange={(e) => editingTopicId ? setEditingTopicName(e.target.value) : setTopicName(e.target.value)}
                    placeholder="Topic name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowTopicModal(false); setEditingTopicId(null); setEditingTopicName(""); setEditingTopicSyllabusId(null); setTopicName(""); setTopicSyllabusId(null); }}>Cancel</Button>
                <Button onClick={editingTopicId ? saveTopic : createTopic} disabled={!(editingTopicId ? editingTopicName : topicName).trim() || !(editingTopicId ? editingTopicSyllabusId : topicSyllabusId)}>
                  {editingTopicId ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">ID</TableHead>
                  <TableHead scope="col">Topic</TableHead>
                  <TableHead scope="col">Syllabus</TableHead>
                  <TableHead scope="col">Content</TableHead>
                  <TableHead scope="col" className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No topics found.</TableCell>
                  </TableRow>
                ) : (
                  topics.map((t) => (
                    <TableRow key={t.topic_id}>
                      <TableCell className="font-mono text-sm">{t.topic_id}</TableCell>
                      <TableCell>{t.topic_name}</TableCell>
                      <TableCell>{getSyllabusName(t.syllabus_id)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {(topicContentMap[t.topic_id] ?? []).length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {(topicContentMap[t.topic_id] ?? []).map((c: any) => c.file_name).join(", ")}
                            </span>
                          )}
                          <input
                            id={`upload-${t.topic_id}`}
                            type="file"
                            accept=".pdf,.csv,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadTopicFile(t.topic_id, f);
                              e.target.value = "";
                            }}
                            disabled={uploadingTopicId === t.topic_id}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1"
                            disabled={uploadingTopicId === t.topic_id}
                            onClick={() => document.getElementById(`upload-${t.topic_id}`)?.click()}
                          >
                            <Upload className="size-3" aria-hidden />
                            {uploadingTopicId === t.topic_id ? "Uploading..." : "Upload"}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => { setEditingTopicId(t.topic_id); setEditingTopicName(t.topic_name); setEditingTopicSyllabusId(t.syllabus_id); loadTopicContent(t.topic_id); }} className="mr-2">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget({ type: "topic", id: t.topic_id })}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
      )}
    </div>
  );
}

