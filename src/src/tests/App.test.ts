import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";

describe("App.vue", () => {
  it("mounted", () => {
    const wrapper = mount(App);

    expect(wrapper.exists()).toBeTruthy();
  });
});
