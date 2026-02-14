import React from "react";
import { adminPost, adminPut, adminDelete, contentListCourses, contentListSubjects, contentListSyllabi, contentListTopics } from "../../hooks/useApi";

export default function AdminContentManager() {
  const adminCtx = (() => {
    try {
      // lazy import to avoid breaking outside admin layout
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("./AdminLayout");
      return (mod.useAdmin as any)();
    } catch {
      return null;
    }
  })();
  const contentTab = adminCtx ? adminCtx.contentSubTab : "courses";
  const setContentTab = adminCtx ? adminCtx.setContentSubTab : (() => {});

  // courses
  const [courses, setCourses] = React.useState<any[]>([]);
  const [courseName, setCourseName] = React.useState("");
  const [editingCourse, setEditingCourse] = React.useState<any | null>(null);

  // subjects
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [subjectName, setSubjectName] = React.useState("");
  const [subjectCourseId, setSubjectCourseId] = React.useState<string | null>(null);

  // syllabi
  const [syllabi, setSyllabi] = React.useState<any[]>([]);
  const [syllabusUnitName, setSyllabusUnitName] = React.useState("");
  const [syllabusSubjectId, setSyllabusSubjectId] = React.useState<string | null>(null);

  // topics
  const [topics, setTopics] = React.useState<any[]>([]);
  const [topicName, setTopicName] = React.useState("");
  const [topicSyllabusId, setTopicSyllabusId] = React.useState<string | null>(null);

  const loadAll = React.useCallback(async () => {
    try {
      const c = await contentListCourses();
      setCourses(Array.isArray(c) ? c : (c && Array.isArray((c as any).results) ? (c as any).results : []));
      const s = await contentListSubjects();
      setSubjects(Array.isArray(s) ? s : (s && Array.isArray((s as any).results) ? (s as any).results : []));
      const sy = await contentListSyllabi();
      setSyllabi(Array.isArray(sy) ? sy : (sy && Array.isArray((sy as any).results) ? (sy as any).results : []));
      const t = await contentListTopics();
      setTopics(Array.isArray(t) ? t : (t && Array.isArray((t as any).results) ? (t as any).results : []));
    } catch (e) {
      console.error(e);
      setCourses([]);
      setSubjects([]);
      setSyllabi([]);
      setTopics([]);
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Courses actions
  const createCourse = async () => {
    if (!courseName) return;
    await adminPost("/content/courses", { course_name: courseName });
    setCourseName("");
    await loadAll();
  };

  const startEditCourse = (c: any) => {
    setEditingCourse(c);
    setCourseName(c.course_name);
  };

  const saveCourse = async () => {
    if (!editingCourse) return;
    await adminPut(`/content/courses/${editingCourse.course_id}`, { course_name: courseName });
    setEditingCourse(null);
    setCourseName("");
    await loadAll();
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Delete course?")) return;
    await adminDelete(`/content/courses/${id}`);
    await loadAll();
  };

  // Subjects actions
  const createSubject = async () => {
    if (!subjectName || !subjectCourseId) return alert("Select course and name");
    await adminPost("/content/subjects", { course_id: subjectCourseId, subject_name: subjectName });
    setSubjectName("");
    await loadAll();
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Delete subject?")) return;
    await adminDelete(`/content/subjects/${id}`);
    await loadAll();
  };
  const [editingSubjectId, setEditingSubjectId] = React.useState<string | null>(null);
  const [editingSubjectName, setEditingSubjectName] = React.useState("");
  const [editingSubjectCourseId, setEditingSubjectCourseId] = React.useState<string | null>(null);
  const startEditSubject = (s: any) => {
    setEditingSubjectId(s.subject_id);
    setEditingSubjectName(s.subject_name);
    setEditingSubjectCourseId(s.course_id);
  };
  const saveSubject = async () => {
    if (!editingSubjectId) return;
    await adminPut(`/content/subjects/${editingSubjectId}`, { course_id: editingSubjectCourseId, subject_name: editingSubjectName, semester: 1 });
    setEditingSubjectId(null);
    setEditingSubjectName("");
    setEditingSubjectCourseId(null);
    await loadAll();
  };

  // Syllabi actions
  const createSyllabus = async () => {
    if (!syllabusUnitName || !syllabusSubjectId) return alert("Select subject and unit name");
    await adminPost("/content/syllabi", { subject_id: syllabusSubjectId, unit_name: syllabusUnitName });
    setSyllabusUnitName("");
    await loadAll();
  };

  const deleteSyllabus = async (id: string) => {
    if (!confirm("Delete syllabus?")) return;
    await adminDelete(`/content/syllabi/${id}`);
    await loadAll();
  };
  const [editingSyllabusId, setEditingSyllabusId] = React.useState<string | null>(null);
  const [editingSyllabusUnitName, setEditingSyllabusUnitName] = React.useState("");
  const [editingSyllabusSubjectId, setEditingSyllabusSubjectId] = React.useState<string | null>(null);
  const startEditSyllabus = (sy: any) => {
    setEditingSyllabusId(sy.syllabus_id);
    setEditingSyllabusUnitName(sy.unit_name);
    setEditingSyllabusSubjectId(sy.subject_id);
  };
  const saveSyllabus = async () => {
    if (!editingSyllabusId) return;
    await adminPut(`/content/syllabi/${editingSyllabusId}`, { subject_id: editingSyllabusSubjectId, unit_name: editingSyllabusUnitName, unit_order: 1 });
    setEditingSyllabusId(null);
    setEditingSyllabusUnitName("");
    setEditingSyllabusSubjectId(null);
    await loadAll();
  };

  // Topics actions
  const createTopic = async () => {
    if (!topicName || !topicSyllabusId) return alert("Select syllabus and topic name");
    await adminPost("/content/topics", { syllabus_id: topicSyllabusId, topic_name: topicName });
    setTopicName("");
    await loadAll();
  };

  const deleteTopic = async (id: string) => {
    if (!confirm("Delete topic?")) return;
    await adminDelete(`/content/topics/${id}`);
    await loadAll();
  };
  const [editingTopicId, setEditingTopicId] = React.useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = React.useState("");
  const [editingTopicSyllabusId, setEditingTopicSyllabusId] = React.useState<string | null>(null);
  const startEditTopic = (t: any) => {
    setEditingTopicId(t.topic_id);
    setEditingTopicName(t.topic_name);
    setEditingTopicSyllabusId(t.syllabus_id);
  };
  const saveTopic = async () => {
    if (!editingTopicId) return;
    await adminPut(`/content/topics/${editingTopicId}`, { syllabus_id: editingTopicSyllabusId, topic_name: editingTopicName, description: "" });
    setEditingTopicId(null);
    setEditingTopicName("");
    setEditingTopicSyllabusId(null);
    await loadAll();
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-3">Content Manager</h2>
      {/* Content navigation moved to left sidebar; keep header minimal */}

      {contentTab === "courses" && (
        <div>
          <div className="mb-4">
            <input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" className="border px-2 py-1 mr-2" />
            {editingCourse ? (
              <button onClick={saveCourse} className="px-3 py-1 bg-green-600 text-white rounded mr-2">Save</button>
            ) : (
              <button onClick={createCourse} className="px-3 py-1 bg-blue-600 text-white rounded mr-2">Create</button>
            )}
            {editingCourse && <button onClick={() => { setEditingCourse(null); setCourseName(""); }} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>}
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th scope="col" className="px-2 py-1">ID</th>
                <th scope="col" className="px-2 py-1">Name</th>
                <th scope="col" className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-sm text-gray-600">No courses found.</td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.course_id} className="border-t">
                    <td className="px-2 py-2">{c.course_id}</td>
                    <td className="px-2 py-2">{c.course_name}</td>
                    <td className="px-2 py-2">
                      <button onClick={() => startEditCourse(c)} className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                      <button onClick={() => deleteCourse(c.course_id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {contentTab === "subjects" && (
        <div>
          <div className="mb-4">
            <select value={subjectCourseId ?? ""} onChange={(e) => setSubjectCourseId(e.target.value || null)} className="border px-2 py-1 mr-2">
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
            </select>
            <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Subject name" className="border px-2 py-1 mr-2" />
            <button onClick={createSubject} className="px-3 py-1 bg-blue-600 text-white rounded">Create Subject</button>
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th scope="col" className="px-2 py-1">ID</th>
                <th scope="col" className="px-2 py-1">Name</th>
                <th scope="col" className="px-2 py-1">Course</th>
                <th scope="col" className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-sm text-gray-600">No subjects found.</td>
                </tr>
              ) : (
                subjects.map((s) => (
                  <tr key={s.subject_id} className="border-t">
                    <td className="px-2 py-2">{s.subject_id}</td>
                    <td className="px-2 py-2">
                      {editingSubjectId === s.subject_id ? (
                        <div className="flex items-center">
                          <input value={editingSubjectName} onChange={(e) => setEditingSubjectName(e.target.value)} className="border px-2 py-1 mr-2" />
                          <select value={editingSubjectCourseId ?? ""} onChange={(e) => setEditingSubjectCourseId(e.target.value || null)} className="border px-2 py-1 mr-2">
                            {courses.map((c) => <option key={c.course_id} value={c.course_id}>{c.course_name}</option>)}
                          </select>
                          <button onClick={saveSubject} className="px-2 py-1 bg-green-600 text-white rounded mr-2">Save</button>
                          <button onClick={() => setEditingSubjectId(null)} className="px-2 py-1 bg-gray-200 rounded">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-1">{s.subject_name}</div>
                          <div className="text-sm text-gray-600">{(courses.find((c) => c.course_id === s.course_id) || {}).course_name || "-"}</div>
                        </>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {editingSubjectId !== s.subject_id && <button onClick={() => startEditSubject(s)} className="px-2 py-1 bg-yellow-500 text-white rounded mr-2">Edit</button>}
                      <button onClick={() => deleteSubject(s.subject_id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {contentTab === "syllabi" && (
        <div>
          <div className="mb-4">
            <select value={syllabusSubjectId ?? ""} onChange={(e) => setSyllabusSubjectId(e.target.value || null)} className="border px-2 py-1 mr-2">
              <option value="">Select subject</option>
              {subjects.map((s) => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
            </select>
            <input value={syllabusUnitName} onChange={(e) => setSyllabusUnitName(e.target.value)} placeholder="Unit name" className="border px-2 py-1 mr-2" />
            <button onClick={createSyllabus} className="px-3 py-1 bg-blue-600 text-white rounded">Create Syllabus</button>
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th scope="col" className="px-2 py-1">ID</th>
                <th scope="col" className="px-2 py-1">Unit</th>
                <th scope="col" className="px-2 py-1">Subject</th>
                <th scope="col" className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {syllabi.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-sm text-gray-600">No syllabi found.</td>
                </tr>
              ) : (
                syllabi.map((sy) => (
                  <tr key={sy.syllabus_id} className="border-t">
                    <td className="px-2 py-2">{sy.syllabus_id}</td>
                    <td className="px-2 py-2">
                      {editingSyllabusId === sy.syllabus_id ? (
                        <div className="flex items-center">
                          <input value={editingSyllabusUnitName} onChange={(e) => setEditingSyllabusUnitName(e.target.value)} className="border px-2 py-1 mr-2" />
                          <select value={editingSyllabusSubjectId ?? ""} onChange={(e) => setEditingSyllabusSubjectId(e.target.value || null)} className="border px-2 py-1 mr-2">
                            {subjects.map((s) => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
                          </select>
                          <button onClick={saveSyllabus} className="px-2 py-1 bg-green-600 text-white rounded mr-2">Save</button>
                          <button onClick={() => setEditingSyllabusId(null)} className="px-2 py-1 bg-gray-200 rounded">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-1">{sy.unit_name}</div>
                          <div className="text-sm text-gray-600">{(subjects.find((s) => s.subject_id === sy.subject_id) || {}).subject_name || "-"}</div>
                        </>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {editingSyllabusId !== sy.syllabus_id && <button onClick={() => startEditSyllabus(sy)} className="px-2 py-1 bg-yellow-500 text-white rounded mr-2">Edit</button>}
                      <button onClick={() => deleteSyllabus(sy.syllabus_id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {contentTab === "topics" && (
        <div>
          <div className="mb-4">
            <select value={topicSyllabusId ?? ""} onChange={(e) => setTopicSyllabusId(e.target.value || null)} className="border px-2 py-1 mr-2">
              <option value="">Select syllabus</option>
              {syllabi.map((sy) => <option key={sy.syllabus_id} value={sy.syllabus_id}>{sy.unit_name}</option>)}
            </select>
            <input value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic name" className="border px-2 py-1 mr-2" />
            <button onClick={createTopic} className="px-3 py-1 bg-blue-600 text-white rounded">Create Topic</button>
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th scope="col" className="px-2 py-1">ID</th>
                <th scope="col" className="px-2 py-1">Topic</th>
                <th scope="col" className="px-2 py-1">Syllabus</th>
                <th scope="col" className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-sm text-gray-600">No topics found.</td>
                </tr>
              ) : (
                topics.map((t) => (
                  <tr key={t.topic_id} className="border-t">
                    <td className="px-2 py-2">{t.topic_id}</td>
                    <td className="px-2 py-2">
                      {editingTopicId === t.topic_id ? (
                        <div className="flex items-center">
                          <input value={editingTopicName} onChange={(e) => setEditingTopicName(e.target.value)} className="border px-2 py-1 mr-2" />
                          <select value={editingTopicSyllabusId ?? ""} onChange={(e) => setEditingTopicSyllabusId(e.target.value || null)} className="border px-2 py-1 mr-2">
                            {syllabi.map((sy) => <option key={sy.syllabus_id} value={sy.syllabus_id}>{sy.unit_name}</option>)}
                          </select>
                          <button onClick={saveTopic} className="px-2 py-1 bg-green-600 text-white rounded mr-2">Save</button>
                          <button onClick={() => setEditingTopicId(null)} className="px-2 py-1 bg-gray-200 rounded">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <div className="mb-1">{t.topic_name}</div>
                          <div className="text-sm text-gray-600">{(syllabi.find((sy) => sy.syllabus_id === t.syllabus_id) || {}).unit_name || "-"}</div>
                        </>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {editingTopicId !== t.topic_id && <button onClick={() => startEditTopic(t)} className="px-2 py-1 bg-yellow-500 text-white rounded mr-2">Edit</button>}
                      <button onClick={() => deleteTopic(t.topic_id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

