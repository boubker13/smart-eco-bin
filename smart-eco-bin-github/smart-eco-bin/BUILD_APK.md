# 📱 Générer l'APK Smart Eco Bin

## ✅ Prérequis (à installer sur votre PC)
1. **Java JDK 17+** → https://adoptium.net
2. **Android Studio** → https://developer.android.com/studio  
   (inclut le SDK Android automatiquement)

---

## 🚀 Méthode 1 : Android Studio (recommandée, la plus simple)

1. Ouvrez **Android Studio**
2. Cliquez **"Open"** → sélectionnez le dossier **`android/`** de ce projet
3. Attendez la synchronisation Gradle (1-2 min)
4. Menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**
5. L'APK se trouve dans :  
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

## ⚡ Méthode 2 : Ligne de commande (si Android SDK installé)

```bash
# Depuis le dossier racine du projet
cd android
./gradlew assembleDebug

# L'APK sera ici :
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 Informations de l'application
- **Nom** : Smart Eco Bin
- **Package** : com.smartecobin.app
- **Version** : 1.0
- **Min Android** : 5.1 (API 22)
- **Target Android** : 14 (API 34)

---

## 🔄 Mettre à jour l'app web dans l'APK

Si vous modifiez les fichiers React :
```bash
npm run build        # Recompiler le web
npx cap sync android # Synchroniser dans Android
```
Puis recompiler l'APK.
