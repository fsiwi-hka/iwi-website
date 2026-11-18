using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IWI_Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class DropProtocolsAndInfoscreenTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InfoscreenSlides",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "Protocols",
                schema: "backrooms");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InfoscreenSlides",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DurationSeconds = table.Column<int>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    UploadedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
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
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    MeetingDate = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Semester = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    File = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Protocols", x => x.Id);
                });

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
        }
    }
}
