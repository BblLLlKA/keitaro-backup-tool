import { RoleResponseDto } from '../../role/dto/role-response.dto.js';

export class UserResponseDto {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.role = user.role ? new RoleResponseDto(user.role) : null;
        this.isActive = user.isActive;

        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
