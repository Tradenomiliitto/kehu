import { handlePageView } from "./AnalyticsUtil";

describe("client:utils:AnalyticsUtil", () => {
  let gaStub;
  const pathname = "/path/name";
  const search = "?search=jooh";

  beforeEach(() => {
    gaStub = jest.fn();
  });

  describe("handlePageView", () => {
    describe("when ga is available", () => {
      beforeEach(() => {
        window.ga = gaStub;
      });

      it("handles location change with pathname", () => {
        handlePageView({ pathname });
        expectAnalytics(pathname);
      });

      it("handles location change with search string", () => {
        handlePageView({ search });
        expectAnalytics(search);
      });

      it("handles location change with pathname and search string", () => {
        handlePageView({ pathname, search });
        expectAnalytics(`${pathname}${search}`);
      });
    });

    describe("when ga is not available", () => {
      it("does nothing", () => {
        expectNoAnalytics();
      });
    });
  });

  function expectAnalytics(path) {
    expect(gaStub).toHaveBeenCalledWith("set", "page", path);
    expect(gaStub).toHaveBeenCalledWith("send", "pageview");
  }

  function expectNoAnalytics() {
    expect(gaStub).not.toHaveBeenCalled();
  }
});
