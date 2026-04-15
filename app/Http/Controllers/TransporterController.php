<?php

namespace App\Http\Controllers;

use App\Models\Transporter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransporterController extends Controller
{
    public function index()
    {
        return Inertia::render('Master/TransporterMaster', [
            'transporters' => Transporter::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'transporter_name' => 'required|string|max:255',
            'transporter_id' => 'required_without:gst_no|nullable|string|max:255',
            'gst_no' => 'required_without:transporter_id|nullable|string|max:255',
            'contact_person_name' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        Transporter::create($request->all());

        return redirect()->back()->with('success', 'Transporter created successfully.');
    }

    public function update(Request $request, Transporter $transporterMaster)
    {
        $request->validate([
            'transporter_name' => 'required|string|max:255',
            'transporter_id' => 'required_without:gst_no|nullable|string|max:255',
            'gst_no' => 'required_without:transporter_id|nullable|string|max:255',
            'contact_person_name' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        $transporterMaster->update($request->all());

        return redirect()->back()->with('success', 'Transporter updated successfully.');
    }

    public function destroy(Transporter $transporterMaster)
    {
        $transporterMaster->delete();
        return redirect()->back()->with('success', 'Transporter deleted successfully.');
    }
}
