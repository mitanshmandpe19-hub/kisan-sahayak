const API_BASE = '/api';

export const api = {
  async sendOtp(phone_number) {
    const res = await fetch(`${API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number })
    });
    return res.json();
  },

  async verifyOtp(phone_number, entered_otp) {
    const res = await fetch(`${API_BASE}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, entered_otp })
    });
    return res.json();
  },

  async saveName(user_id, name) {
    const res = await fetch(`${API_BASE}/save-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, name })
    });
    return res.json();
  },

  async saveAnswers(user_id, farmer_type, answers, preferred_language = 'en') {
    const res = await fetch(`${API_BASE}/save-answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, farmer_type, answers, preferred_language })
    });
    return res.json();
  },

  async matchSchemes(user_id, farmer_type, answers = {}, language = 'en') {
    const res = await fetch(`${API_BASE}/match-schemes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, farmer_type, answers, language })
    });
    return res.json();
  },

  async getUserProfile(user_id) {
    const res = await fetch(`${API_BASE}/get-user-profile/${user_id}`);
    return res.json();
  },

  async generateExplanation(user_id, scheme_id, scheme_name, status, answers = {}, language = 'en', blocker_reason = null) {
    const res = await fetch(`${API_BASE}/generate-explanation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        scheme_id,
        scheme_name,
        status,
        answers,
        language,
        blocker_reason
      })
    });
    return res.json();
  },

  async getSchemes() {
    const res = await fetch(`${API_BASE}/schemes`);
    return res.json();
  }
};

export default api;
