import { TeamResponseDto } from '../../team/dto/index.js';

export class ServerResponseDto {
    constructor(server) {
        this.id = server.id;
        this.name = server.name;
        this.ip = server.ip;
        this.port = server.port;
        this.username = server.username;
        this.password = server.password;
        this.type = server.type;
        this.isDumping = server.isDumping;
        this.isActive = server.isActive;
        this.team = server.team ? new TeamResponseDto(server.team) : null;
        this.createdAt = server.createdAt;
        this.updatedAt = server.updatedAt;
    }
}
