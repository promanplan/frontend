// Centralized client for backend GitHub integration endpoints
// Endpoints provided by backend:
// - POST /api/github/oauth
// - POST /api/github/installation
// - GET  /api/github/repos
// - GET  /api/github/branches
// - GET  /api/github/commit
// - POST /api/github/deploy

export interface ExchangeOAuthCodeRequest {
	code: string
}

export interface ExchangeOAuthCodeResponse {
	success: boolean
	accessToken?: string
	user?: {
		id: number
		login: string
		avatar_url?: string
	}
	message?: string
}

export interface SendInstallationRequest {
	installation_id: string
}

export interface RepoInfo {
	id: number
	full_name: string
	default_branch?: string
	private?: boolean
}

export interface GetReposResponse {
	repos: RepoInfo[]
}

export interface DeployRequest {
	repoFullName: string
	branch: string
}

export interface ApiError {
	status: number
	message: string
}

const BASE_URL = "";

async function handleResponse<T>(res: Response): Promise<T> {
	if (!res.ok) {
		const message = await safeMessage(res);
		throw { status: res.status, message } as ApiError;
	}
	return (await res.json()) as T;
}

async function safeMessage(res: Response): Promise<string> {
	try {
		const data = (await res.json()) as { message?: string };
		return data?.message || res.statusText;
	} catch {
		return res.statusText;
	}
}

export const githubApi = {
	async exchangeOAuthCode(payload: ExchangeOAuthCodeRequest) {
		const res = await fetch(`${BASE_URL}/api/github/oauth`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			credentials: "include",
		});
		return handleResponse<ExchangeOAuthCodeResponse>(res);
	},

	async sendInstallation(payload: SendInstallationRequest) {
		const res = await fetch(`${BASE_URL}/api/github/installation`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			credentials: "include",
		});
		return handleResponse<{ success: boolean }>(res);
	},

	async getRepos() {
		const res = await fetch(`${BASE_URL}/api/github/repos`, {
			method: "GET",
			credentials: "include",
		});
		return handleResponse<GetReposResponse>(res);
	},

	async getBranches(repoFullName: string) {
		const res = await fetch(`${BASE_URL}/api/github/branches?repo=${encodeURIComponent(repoFullName)}`, {
			method: "GET",
			credentials: "include",
		});
		return handleResponse<{ branches: { name: string }[] }>(res);
	},

	async getCommit(repoFullName: string, branch: string) {
		const res = await fetch(`${BASE_URL}/api/github/commit?repo=${encodeURIComponent(repoFullName)}&branch=${encodeURIComponent(branch)}`, {
			method: "GET",
			credentials: "include",
		});
		return handleResponse<{ commit: { sha: string; message: string; author: { name: string; date: string }; url: string } }>(res);
	},

	async deploy(payload: DeployRequest) {
		const res = await fetch(`${BASE_URL}/api/github/deploy`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			credentials: "include",
		});
		return handleResponse<{ success: boolean; message?: string }>(res);
	},
};

export default githubApi;


