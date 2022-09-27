<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('stationary-combustion');
});

Route::post('/calculate', [\App\Http\Controllers\Controller::class, "calculate"]);
Route::post('/store_calculation', [\App\Http\Controllers\Controller::class, "store_calculation"]);
Route::post('/delete_calculation', [\App\Http\Controllers\Controller::class, "delete_calculation"]);
