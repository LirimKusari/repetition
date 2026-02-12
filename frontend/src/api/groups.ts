import { get, post, put, del } from './client'
import type { Group, CreateGroupRequest, UpdateGroupRequest } from '@/types'

export const groupsApi = {
  getAll: () => get<Group[]>('/groups'),
  getById: (id: string) => get<Group>(`/groups/${id}`),
  create: (data: CreateGroupRequest) => post<Group>('/groups', data),
  update: (id: string, data: UpdateGroupRequest) => put<Group>(`/groups/${id}`, data),
  delete: (id: string) => del<{ message: string }>(`/groups/${id}`),
}
