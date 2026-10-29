package com.soadzoor.kontroller;
import android.app.Activity;
import android.app.Application;
import android.graphics.Color;
import android.os.Build;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import org.junit.*;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.android.controller.ActivityController;
import org.robolectric.annotation.Config;
import org.robolectric.annotation.GraphicsMode;
import static org.junit.Assert.*;
@RunWith(RobolectricTestRunner.class)
@Config(sdk={28,35},application=Application.class)
@GraphicsMode(GraphicsMode.Mode.LEGACY)
public class SystemBarsCompatTest {
    private ActivityController<Activity> controller;
    private Activity activity;
    @Before public void create() {
        controller=Robolectric.buildActivity(Activity.class);
        activity=controller.get(); activity.setTheme(R.style.AppTheme);
        controller.setup().visible();
    }
    @After public void destroy() { controller.pause().stop().destroy(); }
    @Test public void lightAppBackgroundKeepsSystemIconsReadableAcrossAndroidVersions() {
        SystemBarsCompat.enableEdgeToEdge(activity.getWindow());
        WindowInsetsControllerCompat bars=WindowCompat.getInsetsController(activity.getWindow(),activity.getWindow().getDecorView());
        assertTrue(bars.isAppearanceLightStatusBars());
        assertTrue(bars.isAppearanceLightNavigationBars());
        if(Build.VERSION.SDK_INT>=30)
            assertEquals(WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS,activity.getWindow().getAttributes().layoutInDisplayCutoutMode);
    }
    @Test public void statusVisibilityUsesTheSystemBarsController() {
        SystemBarsCompat.enableEdgeToEdge(activity.getWindow());
        assertTrue(activity.getWindow().getDecorView().isAttachedToWindow());
        SystemBarsCompat.statusBarHide(activity.getWindow());
        if(Build.VERSION.SDK_INT<30) assertNotEquals(0,activity.getWindow().getDecorView().getSystemUiVisibility() & android.view.View.SYSTEM_UI_FLAG_FULLSCREEN);
        SystemBarsCompat.statusBarShow(activity.getWindow());
        WindowInsetsControllerCompat bars=WindowCompat.getInsetsController(activity.getWindow(),activity.getWindow().getDecorView());
        if(Build.VERSION.SDK_INT>=30)
            assertEquals(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE,bars.getSystemBarsBehavior());
        else
            assertEquals(0,activity.getWindow().getDecorView().getSystemUiVisibility() & android.view.View.SYSTEM_UI_FLAG_FULLSCREEN);
    }
}
