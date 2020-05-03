package com.refill_rn;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.ReactActivity;

import androidx.core.content.ContextCompat;
import custom.CommonModule;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "refill_rn";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

      Log.d("Refill Hash start", "Refill Hash start");

    Intent s = new Intent(this, Splash.class);
    startActivity(s);

    if(Build.VERSION.SDK_INT >= 21){
      getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.theme_color));
    }

  }

    private void printKeyHash() {
        // Add code to print out the key hash
        try {
            PackageInfo info = getPackageManager().getPackageInfo("com.refill_rn", PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.d("Refill KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException e) {
            Log.e("KeyHash:", e.toString());
        } catch (NoSuchAlgorithmException e) {
            Log.e("KeyHash:", e.toString());
        }
    }

  @Override
   protected ReactActivityDelegate createReactActivityDelegate() {
      return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
          protected ReactRootView createRootView() {
              return new RNGestureHandlerEnabledRootView(MainActivity.this);
          }
      };
    }
}
