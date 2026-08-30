export type AuditLog = {
    id: number;
    action: string;
    subject_type: string | null;
    subject_id: number | null;
    description: string | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
};

export type AuditLogPaginator = {
    data: AuditLog[];
    current_page: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export type AuditLogFilters = {
    search: string | null;
    action: string | null;
    user_id: number | null;
    start_date: string | null;
    end_date: string | null;
};

export type AuditAdministrator = {
    id: number;
    name: string;
    email: string;
};
