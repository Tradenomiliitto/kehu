import { ShutdownBanner } from "./ShutdownBanner";
import { LangLink } from "../../util/LangLink";

describe("client:components:home:ShutdownBanner", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <ShutdownBanner t={(key, text) => text} i18n={{ language: "en" }} />,
    );
  });

  it("announces the shutdown date", () => {
    expect(component.find(".ShutdownBanner-title").text()).toContain(
      "31.12.2026",
    );
  });

  it("links to the blog post in the current language", () => {
    expect(component.find("a").at(0).prop("href")).toEqual(
      "/en/blogi/kehu-palvelu-suljetaan",
    );
  });

  it("links to the Excel download in the current language", () => {
    expect(component.find("a").at(1).prop("href")).toEqual(
      "/api/v1/kehut/report?lng=en",
    );
  });

  it("links to the PDF report preview", () => {
    expect(component.find(LangLink).prop("to")).toEqual("/raportit?pdf");
  });
});
