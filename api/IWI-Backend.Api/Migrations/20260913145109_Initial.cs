using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IWI_Backend.Api.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "backrooms");

            migrationBuilder.CreateTable(
                name: "HeroSlides",
                schema: "backrooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", maxLength: 32, nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 120, nullable: false),
                    Subtitle = table.Column<string>(type: "TEXT", maxLength: 240, nullable: false),
                    ButtonText = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                    ButtonLink = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CreatorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ModifierId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Modified = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Image = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeroSlides", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HeroSlides_Order",
                schema: "backrooms",
                table: "HeroSlides",
                column: "Order");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HeroSlides",
                schema: "backrooms");
        }
    }
}
