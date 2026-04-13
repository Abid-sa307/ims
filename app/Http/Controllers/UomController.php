<?php

namespace App\Http\Controllers;

use App\Models\Uom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UomController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/UomMaster', [
            'uoms' => Uom::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:uoms,name']);
        Uom::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, Uom $uom)
    {
        $request->validate(['name' => 'required|string|max:255|unique:uoms,name,' . $uom->id]);
        $uom->update($request->all());
        return redirect()->back();
    }

    public function destroy(Uom $uom)
    {
        $uom->delete();
        return redirect()->back();
    }
}
