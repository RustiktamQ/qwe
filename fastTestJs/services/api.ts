import axios from 'axios';
import config from '../config/config';

export default class ApiController {
  async register(name: string, email: string, password: string) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/auth/register`, {
        name,
        email,
        password,
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async login(email: string, password: string) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/auth/login`, {
        email,
        password,
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async isAuthed(token: string) {
    try {
      const res = await axios.get(`${config.FULL_HOST}/auth/isAuthed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async getTestsByTeacher(id: number) {
    try {
      const res = await axios.get(`${config.FULL_HOST}/tests/teacher/${id}`);
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async getAllTests() {
    try {
      const res = await axios.get(`${config.FULL_HOST}/tests`);
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async createTest(dto: any, token: string) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/tests`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async updateTest(id: number, dto: any, token: string) {
    try {
      const res = await axios.put(`${config.FULL_HOST}/tests/${id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async deleteTest(id: number, token: string) {
    try {
      const res = await axios.delete(`${config.FULL_HOST}/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async createQuestion(dto: any, token: string) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/questions`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async deleteQuestion(id: number, token: string) {
    try {
      const res = await axios.delete(`${config.FULL_HOST}/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async createOption(dto: any, token: string) {
    try {
      const res = await axios.post(`${config.FULL_HOST}/options`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async editOption(id: number, dto: any, token: string) {
    try {
      const res = await axios.put(`${config.FULL_HOST}/options/${id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }

  async getOptionsByQuestion(questionId: number) {
    try {
      const res = await axios.get(`${config.FULL_HOST}/options/question/${questionId}`);
      return res.data;
    } catch (err: any) {
      return { error: true, message: err.response?.data || err.message };
    }
  }
}
