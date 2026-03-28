<?php

namespace App\Http\Controllers;

use App\Models\CustomFieldGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomFieldGroupController extends Controller
{
    public function index()
    {
        $customFieldGroups = CustomFieldGroup::latest()->get();
        return Inertia::render('Invoice/CustomFieldGroupMaster', [
            'customFieldGroups' => $customFieldGroups
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'group_name' => 'required|string|max:255',
            'associated_module' => 'required|string|max:255'
        ]);

        CustomFieldGroup::create($validated);

        return redirect()->back()->with('success', 'Custom Field Group created successfully.');
    }

    public function update(Request $request, CustomFieldGroup $customFieldGroup)
    {
        $validated = $request->validate([
            'group_name' => 'required|string|max:255',
            'associated_module' => 'required|string|max:255'
        ]);

        $customFieldGroup->update($validated);

        return redirect()->back()->with('success', 'Custom Field Group updated successfully.');
    }

    public function destroy(CustomFieldGroup $customFieldGroup)
    {
        $customFieldGroup->delete();
        return redirect()->back()->with('success', 'Custom Field Group deleted successfully.');
    }
}
