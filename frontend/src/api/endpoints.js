import api from "./axios";

// ===============================
// AUTH
// ===============================

export const registerUser = (data) =>
  api.post("/auth/register", data).then((response) => response.data);

export const loginUser = (data) =>
  api.post("/auth/login", data).then((response) => response.data);

export const fetchMe = () =>
  api.get("/auth/me").then((response) => response.data);

export const updateTheme = (theme) =>
  api
    .patch("/auth/theme", { theme })
    .then((response) => response.data);

// ===============================
// PROBLEMS
// ===============================

export const fetchProblems = () =>
  api.get("/problems").then((response) => response.data.problems);

export const fetchProblem = (id) =>
  api
    .get(`/problems/${id}`)
    .then((response) => response.data.problem);

export const createProblem = (data) =>
  api
    .post("/problems", data)
    .then((response) => response.data.problem);

export const updateProblem = (id, data) =>
  api
    .put(`/problems/${id}`, data)
    .then((response) => response.data.problem);

export const deleteProblem = (id) =>
  api.delete(`/problems/${id}`).then((response) => response.data);

export const logPracticeSession = (id, outcome) =>
  api
    .post(`/problems/${id}/practice-sessions`, { outcome })
    .then((response) => response.data.problem);

export const scheduleReview = (id, days) =>
  api
    .post(`/problems/${id}/schedule-review`, { days })
    .then((response) => response.data.problem);

export const saveEvaluation = (id, transcript, report) =>
  api
    .post(`/problems/${id}/evaluations`, {
      transcript,
      report,
    })
    .then((response) => response.data.problem);

// ===============================
// PATTERNS
// ===============================

export const fetchPatterns = () =>
  api.get("/patterns").then((response) => response.data.patterns);

export const createPattern = (data) =>
  api
    .post("/patterns", data)
    .then((response) => response.data.pattern);

export const updatePattern = (id, data) =>
  api
    .put(`/patterns/${id}`, data)
    .then((response) => response.data.pattern);

export const deletePattern = (id) =>
  api
    .delete(`/patterns/${id}`)
    .then((response) => response.data);

// ===============================
// MOCK INTERVIEWS
// ===============================

export const fetchMockSessions = () =>
  api
    .get("/mock-sessions")
    .then((response) => response.data.sessions);

export const createMockSession = (data) =>
  api
    .post("/mock-sessions", data)
    .then((response) => response.data.session);

// ===============================
// AI EVALUATION
// ===============================

export const evaluateTranscript = (problem, transcript) =>
  api
    .post("/evaluate", {
      problem,
      transcript,
    })
    .then((response) => response.data.report);