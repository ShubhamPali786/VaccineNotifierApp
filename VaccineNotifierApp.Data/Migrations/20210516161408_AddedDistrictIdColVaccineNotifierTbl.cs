using Microsoft.EntityFrameworkCore.Migrations;

namespace VaccineNotifierApp.Data.Migrations
{
    public partial class AddedDistrictIdColVaccineNotifierTbl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DistrictId",
                table: "VaccineSlotNotifiers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DistrictId",
                table: "VaccineSlotNotifiers");
        }
    }
}
