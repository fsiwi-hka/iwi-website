using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IWI_Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class MembersAndPositions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Members",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 80, nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Members", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Positions",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                    Group = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Positions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PositionMembers",
                schema: "backrooms",
                columns: table => new
                {
                    PositionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MemberId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PositionMembers", x => new { x.PositionId, x.MemberId });
                    table.ForeignKey(
                        name: "FK_PositionMembers_Members_MemberId",
                        column: x => x.MemberId,
                        principalSchema: "backrooms",
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PositionMembers_Positions_PositionId",
                        column: x => x.PositionId,
                        principalSchema: "backrooms",
                        principalTable: "Positions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Members_Name",
                schema: "backrooms",
                table: "Members",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_PositionMembers_MemberId",
                schema: "backrooms",
                table: "PositionMembers",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Positions_Order",
                schema: "backrooms",
                table: "Positions",
                column: "Order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PositionMembers",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "Members",
                schema: "backrooms");

            migrationBuilder.DropTable(
                name: "Positions",
                schema: "backrooms");
        }
    }
}
