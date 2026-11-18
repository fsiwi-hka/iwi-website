using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IWI_Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class BackroomsContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ImageOverlay",
                schema: "backrooms",
                table: "HeroSlides",
                type: "INTEGER",
                nullable: false,
                // Bestehende Slides behalten das bisherige Verhalten (Overlay an).
                defaultValue: true);

            migrationBuilder.CreateTable(
                name: "BackroomsSessions",
                schema: "backrooms",
                columns: table => new
                {
                    TokenHash = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    UserId = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Username = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Roles = table.Column<string>(type: "TEXT", nullable: false),
                    Created = table.Column<long>(type: "INTEGER", nullable: false),
                    ExpiresAt = table.Column<long>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BackroomsSessions", x => x.TokenHash);
                });

            migrationBuilder.CreateTable(
                name: "ContentPages",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Body = table.Column<string>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContentPages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                    LeadPositionId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Tasks = table.Column<string>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Departments_Positions_LeadPositionId",
                        column: x => x.LeadPositionId,
                        principalSchema: "backrooms",
                        principalTable: "Positions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                schema: "backrooms",
                columns: table => new
                {
                    Key = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    Json = table.Column<string>(type: "TEXT", nullable: false),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Key);
                });

            migrationBuilder.CreateTable(
                name: "InfoscreenSlides",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    DurationSeconds = table.Column<int>(type: "INTEGER", nullable: false),
                    UploadedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Media = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InfoscreenSlides", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Protocols",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Semester = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    MeetingDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    File = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Protocols", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sponsors",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    Width = table.Column<int>(type: "INTEGER", nullable: false),
                    Website = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Logo = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sponsors", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BackroomsSessions_ExpiresAt",
                schema: "backrooms",
                table: "BackroomsSessions",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_ContentPages_Slug",
                schema: "backrooms",
                table: "ContentPages",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_LeadPositionId",
                schema: "backrooms",
                table: "Departments",
                column: "LeadPositionId");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Order",
                schema: "backrooms",
                table: "Departments",
                column: "Order");

            migrationBuilder.CreateIndex(
                name: "IX_InfoscreenSlides_Order",
                schema: "backrooms",
                table: "InfoscreenSlides",
                column: "Order");

            migrationBuilder.CreateIndex(
                name: "IX_Protocols_MeetingDate",
                schema: "backrooms",
                table: "Protocols",
                column: "MeetingDate");

            migrationBuilder.CreateIndex(
                name: "IX_Sponsors_Order",
                schema: "backrooms",
                table: "Sponsors",
                column: "Order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BackroomsSessions",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "ContentPages",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "Departments",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "Documents",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "InfoscreenSlides",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "Protocols",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "Sponsors",
                schema: "backrooms");

            migrationBuilder.DropColumn(
                name: "ImageOverlay",
                schema: "backrooms",
                table: "HeroSlides");
        }
    }
}
