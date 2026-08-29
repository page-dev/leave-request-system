export type UserRole = 'administrator' | 'employee';

export type UserStatus = 'active' | 'inactive';

export type ManagedUser = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type UserFormData = {
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    password: string;
    password_confirmation: string;
};
