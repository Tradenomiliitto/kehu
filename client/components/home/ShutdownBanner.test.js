import { ShutdownBanner } from "./ShutdownBanner";
import ReportPdfDownload from "../report/ReportPdfDownload";

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

  it("does not render the PDF report by default", () => {
    expect(component.find(ReportPdfDownload).exists()).toBeFalsy();
  });

  describe("when the PDF button is clicked", () => {
    beforeEach(() => {
      component.find("button").simulate("click");
    });

    it("downloads the PDF report", () => {
      expect(component.find(ReportPdfDownload).exists()).toBeTruthy();
      expect(component.find("button").prop("disabled")).toBe(true);
    });

    it("enables the button again when the download is done", () => {
      component.find(ReportPdfDownload).prop("onDone")();
      expect(component.find(ReportPdfDownload).exists()).toBeFalsy();
      expect(component.find("button").prop("disabled")).toBe(false);
    });
  });
});
