using Microsoft.EntityFrameworkCore.Migrations;

namespace VaccineNotifierApp.Data.Migrations
{
    public partial class AddVaccineSlotNotifierTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VaccineSlotNotifiers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subscribe18PlusNotifier = table.Column<bool>(type: "bit", nullable: false),
                    Subscribe45PlusNotifier = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccineSlotNotifiers", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VaccineSlotNotifiers");
        }
    }
}
