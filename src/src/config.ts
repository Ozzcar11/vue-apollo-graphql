import { h } from "vue";
import { type IconOptions, type IconProps } from "vuetify";
import { VSvgIcon } from "vuetify/components";
import { camelCase } from "lodash-es";
import * as mdiIcons from "@mdi/js";

export const Colors = {
  primary: "#2863D8",
  secondary: "#EAF0FC",
  error: "#FF5252",
  "gray-light": "#F5F5F5",
};

export const Icons: IconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: {
      component: (props: IconProps) => {
        const iconName = camelCase(props.icon as string);
        // eslint-disable-next-line import/namespace
        const icon = mdiIcons[iconName as keyof typeof mdiIcons];

        return h(VSvgIcon, { ...props, icon });
      },
    },
  },
};
