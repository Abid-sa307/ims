<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Master/ProjectMaster', [
            'projects' => Project::with('location')->get(),
            'locations' => Location::where('location_type', '!=', 'Customer')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'project_name' => 'required|string|max:255',
            'project_code' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|boolean'
        ]);

        Project::create($request->all());

        return redirect()->back()->with('success', 'Project created successfully.');
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'location_id' => 'required|exists:locations,id',
            'project_name' => 'required|string|max:255',
            'project_code' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|boolean'
        ]);

        $project->update($request->all());

        return redirect()->back()->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->back()->with('success', 'Project deleted successfully.');
    }
}
