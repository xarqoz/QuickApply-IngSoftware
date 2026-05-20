export interface ProfileData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    portfolio: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
}

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'API request failed');
  }
  return data;
};

export const authRegister = async (email: string, password: string) => {
  return handleResponse(
    await fetch(`${apiBase}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  );
};

export const authLogin = async (email: string, password: string) => {
  return handleResponse(
    await fetch(`${apiBase}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  );
};

export const getProfile = async (userId: string) => {
  return handleResponse(
    await fetch(`${apiBase}/api/profile/${userId}`),
  );
};

export const saveProfile = async (userId: string, profileData: ProfileData) => {
  return handleResponse(
    await fetch(`${apiBase}/api/profile/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    }),
  );
};

export const getApplications = async (userId: string) => {
  return handleResponse(
    await fetch(`${apiBase}/api/applications/${userId}`),
  );
};

export const createApplication = async (userId: string, job: any, score: number) => {
  return handleResponse(
    await fetch(`${apiBase}/api/applications/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job, score }),
    }),
  );
};

export const generateAutofillMapping = async (profile: ProfileData, pageFields: string[]) => {
  return handleResponse(
    await fetch(`${apiBase}/api/ai/autofill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, pageFields }),
    }),
  );
};
