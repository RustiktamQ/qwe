import axios from 'https://cdn.jsdelivr.net/npm/axios@1.7.4/+esm';
import config from '../config.js';

export default class ApiController {
  async register(name, email, password) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/auth/register`, {
        name,
        email,
        password,
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async login(email, password) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/auth/login`, {
        email,
        password,
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async isAuthed(token) {
    try {
      const res = await axios.get(`${config.FULL_HOST}/auth/isAuthed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async getTestsByTeacher(id) {
    try {
      const res = await axios.get(`${config.FULL_HOST}/tests/teacher/${id}`);
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async getAllTests() {
    try {
      const res = await axios.get(`${config.FULL_HOST}/tests`);
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async createTest(dto, token) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/tests`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async updateTest(id, dto, token) {
    try {
      const res = await axios.put(`${config.FULL_HOST}/tests/${id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async deleteTest(id, token) {
    try {
      const res = await axios.delete(`${config.FULL_HOST}/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async createQuestion(dto, token) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/questions`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async deleteQuestion(id, token) {
    try {
      const res = await axios.delete(`${config.FULL_HOST}/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async answerQuestion(dto) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/questions/answer`, dto);
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async createOption(dto, token) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/options`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async editOption(id, dto, token) {
    try {
      const res = await axios.put(`${config.FULL_HOST}/options/${id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async getOptionsByQuestion(questionId) {
    try {
      const res = await axios.get(
        `${config.FULL_HOST}/options/question/${questionId}`
      );
      return res.data;
    } catch (err) {
      return { error: true, message: err.response?.data || err.message };
    }
  }
}
