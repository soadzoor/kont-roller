package com.soadzoor.kontroller;

import android.os.Build;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

/** Edge-to-edge for KontRoller's light UI without deprecated bar-color setters or cutout modes. */
public final class SystemBarsCompat {
    private SystemBarsCompat() {}
    public static void enableEdgeToEdge(Window window) {
        // Android 15+ enforces edge-to-edge. Earlier Android versions use compatible decor flags;
        // their transparent bar backgrounds are supplied by version-qualified theme resources.
        if (Build.VERSION.SDK_INT < 35) WindowCompat.setDecorFitsSystemWindows(window, false);
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        controller.setAppearanceLightStatusBars(true);
        controller.setAppearanceLightNavigationBars(true);
        if (Build.VERSION.SDK_INT >= 29) window.setNavigationBarContrastEnforced(true);
        if (Build.VERSION.SDK_INT >= 30) {
            WindowManager.LayoutParams attributes = window.getAttributes();
            attributes.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS;
            window.setAttributes(attributes);
        }
    }
    public static void statusBarHide(Window window) {
        if (!window.getDecorView().isAttachedToWindow()) return;
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.statusBars());
    }
    public static void statusBarShow(Window window) {
        if (!window.getDecorView().isAttachedToWindow()) return;
        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.show(WindowInsetsCompat.Type.statusBars());
    }
}
