<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function templateMaster()
    {
        $templateSetting = Setting::where('key', 'invoice_template')->first();
        return Inertia::render('Invoice/TemplateMaster', [
            'selectedTemplate' => $templateSetting ? $templateSetting->value : 'Classic Corporate'
        ]);
    }

    public function saveTemplate(Request $request)
    {
        $validated = $request->validate([
            'template' => 'required|string|max:255'
        ]);

        Setting::updateOrCreate(
            ['key' => 'invoice_template'],
            ['value' => $validated['template']]
        );

        return redirect()->back()->with('success', 'Template saved successfully.');
    }
}
