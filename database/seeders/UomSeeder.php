<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Uom;

class UomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $uoms = [
            ['uom_code' => 'BAG', 'name' => 'BAGS'],
            ['uom_code' => 'BAL', 'name' => 'BALE'],
            ['uom_code' => 'BDL', 'name' => 'BUNDLES'],
            ['uom_code' => 'BKL', 'name' => 'BUCKLES'],
            ['uom_code' => 'BOU', 'name' => 'BILLION OF UNITS'],
            ['uom_code' => 'BOX', 'name' => 'BOX'],
            ['uom_code' => 'BTL', 'name' => 'BOTTLES'],
            ['uom_code' => 'BUN', 'name' => 'BUNCHES'],
            ['uom_code' => 'CAN', 'name' => 'CANS'],
            ['uom_code' => 'CBM', 'name' => 'CUBIC METERS'],
            ['uom_code' => 'CCM', 'name' => 'CUBIC CENTIMETERS'],
            ['uom_code' => 'CMS', 'name' => 'CENTI METERS'],
            ['uom_code' => 'CTN', 'name' => 'CARTONS'],
            ['uom_code' => 'DOZ', 'name' => 'DOZENS'],
            ['uom_code' => 'DRM', 'name' => 'DRUMS'],
            ['uom_code' => 'GGK', 'name' => 'GREAT GROSS'],
            ['uom_code' => 'GMS', 'name' => 'GRAMMES'],
            ['uom_code' => 'GRS', 'name' => 'GROSS'],
            ['uom_code' => 'GYD', 'name' => 'GROSS YARDS'],
            ['uom_code' => 'KGS', 'name' => 'KILOGRAMS'],
            ['uom_code' => 'KLR', 'name' => 'KILOLITRE'],
            ['uom_code' => 'KME', 'name' => 'KILOMETRE'],
            ['uom_code' => 'LTR', 'name' => 'LITRES'],
            ['uom_code' => 'MTR', 'name' => 'METERS'],
            ['uom_code' => 'MLT', 'name' => 'MILILITRE'],
            ['uom_code' => 'MTS', 'name' => 'METRIC TON'],
            ['uom_code' => 'NOS', 'name' => 'NUMBERS'],
            ['uom_code' => 'OTH', 'name' => 'OTHERS'],
            ['uom_code' => 'PAC', 'name' => 'PACKS'],
            ['uom_code' => 'PCS', 'name' => 'PIECES'],
            ['uom_code' => 'PRS', 'name' => 'PAIRS'],
            ['uom_code' => 'QTL', 'name' => 'QUINTAL'],
            ['uom_code' => 'ROL', 'name' => 'ROLLS'],
            ['uom_code' => 'SET', 'name' => 'SETS'],
            ['uom_code' => 'SQF', 'name' => 'SQUARE FEET'],
            ['uom_code' => 'SQM', 'name' => 'SQUARE METERS'],
            ['uom_code' => 'SQY', 'name' => 'SQUARE YARDS'],
            ['uom_code' => 'TBS', 'name' => 'TABLETS'],
            ['uom_code' => 'TGM', 'name' => 'TEN GROSS'],
            ['uom_code' => 'THD', 'name' => 'THOUSANDS'],
            ['uom_code' => 'TON', 'name' => 'TONNES'],
            ['uom_code' => 'TUB', 'name' => 'TUBES'],
            ['uom_code' => 'UGS', 'name' => 'US GALLONS'],
            ['uom_code' => 'UNT', 'name' => 'UNITS'],
            ['uom_code' => 'YDS', 'name' => 'YARDS'],
        ];

        foreach ($uoms as $uom) {
            Uom::updateOrCreate(['uom_code' => $uom['uom_code']], $uom);
        }
    }
}
