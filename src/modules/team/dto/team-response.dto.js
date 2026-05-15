export class TeamResponseDto {
    constructor(team) {
        this.id = team.id;
        this.name = team.name;
        this.createdAt = team.createdAt;
        this.updatedAt = team.updatedAt;
    }
}
