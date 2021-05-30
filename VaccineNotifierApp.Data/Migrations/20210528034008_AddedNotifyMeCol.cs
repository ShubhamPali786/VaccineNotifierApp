using Microsoft.EntityFrameworkCore.Migrations;

namespace VaccineNotifierApp.Data.Migrations
{
    public partial class AddedNotifyMeCol : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "NotifyMe",
                table: "VaccineSlotNotifiers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotifyMe",
                table: "VaccineSlotNotifiers");
        }
    }
}
