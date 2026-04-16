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
        $request->validate([
            'uom_code' => 'required|string|max:50|unique:uoms,uom_code',
            'name' => 'required|string|max:255|unique:uoms,name'
        ]);
        Uom::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, Uom $uomMaster)
    {
        $request->validate([
            'uom_code' => 'required|string|max:50|unique:uoms,uom_code,' . $uomMaster->id,
            'name' => 'required|string|max:255|unique:uoms,name,' . $uomMaster->id
        ]);
        $uomMaster->update($request->all());
        return redirect()->back();
    }

    public function destroy(Uom $uomMaster)
    {
        $uomMaster->delete();
        return redirect()->back();
    }
}
