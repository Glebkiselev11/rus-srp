import { VueI18n } from "vue-i18n";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: VueI18n["t"];
    $tc: VueI18n["tc"];
    $i18n: VueI18n;
  }
}

declare module "*.vue";
