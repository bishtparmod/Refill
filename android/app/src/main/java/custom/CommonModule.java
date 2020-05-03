package custom;

import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.refill_rn.MainActivity;
import com.refill_rn.R;
import com.refill_rn.Splash;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.annotation.Nonnull;

public class CommonModule extends ReactContextBaseJavaModule {

    CommonModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return "RefillCommon";
    }

    @ReactMethod
    public void closeSplashScreen(){
        Splash.activity.finish();
        Splash.activity.overridePendingTransition(R.anim.catalyst_fade_in, R.anim.catalyst_fade_out);
    }

    public static void createKeyHash(Activity activity, String yourPackage) {
        try {
            PackageInfo info = activity.getPackageManager().getPackageInfo(yourPackage, PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.d("Refill KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
            Log.d("Refill KeyHash:", "Refill KeyHash Finish");
        } catch (PackageManager.NameNotFoundException e) {
            Log.d("Refill Hash error one", "d");
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            Log.d("Refill Hash error Two", "d");
            e.printStackTrace();
        }
    }
}
