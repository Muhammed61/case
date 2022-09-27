<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;

class Controller extends BaseController
{

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $extra = [
        "CO2" => 0.57,
        "CH4" => 0.25,
        "N20" => 0.17,
        "CO2E" => 1
    ];

    public function calculate()
    {
        $yakit = \request()->yakit;
        $birim = \request()->birim;
        $miktar = floatval(\request()->miktar);

        $sonuclar = [];

        $yakit_carpani = DB::table("carpan_tablosu")->select("carpan")->where("carpan_id", $yakit)->get()[0]->carpan;
        $birim_carpani = DB::table("carpan_tablosu")->select("carpan")->where("carpan_id", $birim)->get()[0]->carpan;

        $count = 0;
        foreach ($this->extra as $key => $value)
        {
            $deger = $yakit_carpani * $birim_carpani * $miktar * $value;
            $sonuclar[$count] = $deger;

            $count++;
        }

        return response()->json($sonuclar);
    }

    public function store_calculation()
    {
        $id = \request()->id;
        $facility_id = \request()->facility_id;
        $year = \request()->year;
        $fuel = \request()->fuel;
        $amount_of_fuel = \request()->amount_of_fuel;
        $unit = \request()->unit;
        $co2 = \request()->co2;
        $ch4 = \request()->ch4;
        $n2o = \request()->n2o;
        $co2e = \request()->co2e;

        if($id == "-1")
        {
            $id = DB::table("hesaplamalar")->insertGetId([
                "facility_id" => $facility_id,
                "year" => $year,
                "fuel" => $fuel,
                "amount_of_fuel" => $amount_of_fuel,
                "units" => $unit,
                "co2" => $co2,
                "ch4" => $ch4,
                "n2o" => $n2o,
                "co2e" => $co2e,
            ]);
        }else {
            DB::table("hesaplamalar")->where("id", $id)->update([
                "facility_id" => $facility_id,
                "year" => $year,
                "fuel" => $fuel,
                "amount_of_fuel" => $amount_of_fuel,
                "units" => $unit,
                "co2" => $co2,
                "ch4" => $ch4,
                "n2o" => $n2o,
                "co2e" => $co2e,
            ]);
        }

        $sonuclar = [$id, $facility_id, $year, $fuel, $amount_of_fuel, $unit, $co2, $ch4, $n2o, $co2e];

        return response()->json($sonuclar);
    }

    public function delete_calculation()
    {
        $id = \request()->id;

        DB::table("hesaplamalar")->where("id", $id)->delete();
    }
}
