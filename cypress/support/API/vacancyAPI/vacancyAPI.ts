let lastRow: number = 0;
let vacancyId: any;
const path = "cypress/fixtures/alaa.txt";
export default class Vacancy {
  static addVacancy(empNumber: number) {
    const orangeHrVacancyAPIEndPoint = "/api/v2/recruitment/vacancies";
    const vacancyNewData = {
      name: "test",
      jobTitleId: 22,
      employeeId: empNumber,
      numOfPositions: null,
      description: "test join our team engineer",
      status: true,
      isPublished: true,
    };
    cy.request({
      method: "POST",
      url: orangeHrVacancyAPIEndPoint,
      body: vacancyNewData,
    }).then((response) => {
      vacancyId = response.body.data.id;
      const vacancyName = response.body.data.name;
      cy.log(
        "****************Add Vacancy Succefully***************",
        vacancyId,
        vacancyName
      );
    });
  }

  static addAtachmentVacancy() {
    cy.request({
      method: "GET",
      url: "/api/v2/recruitment/vacancies?limit=0",
    }).then((response) => {
      console.log(response, "GET response");
      const lastRow = response.body.meta.total;
      cy.get(
        `:nth-child(${lastRow}) > .oxd-table-row > :nth-child(6) > .oxd-table-cell-actions > :nth-child(2) > .oxd-icon`
      ).click();
      cy.get("button").contains("Add").click();
      cy.get('input[type="file"]').selectFile(path, {
        force: true,
      });
      cy.get(".oxd-form-actions").eq(1).contains("Save").click();
      cy.get(" .oxd-table-cell:nth-child(2)").should("contain", "alaa");
    });
  }

  static deleteVacancy() {
    const DeleteVacancyAPIEndPiont = "/api/v2/recruitment/vacancies";
    const vacanyData = {
      ids: [vacancyId],
    };
    cy.request({
      method: "DELETE",
      url: DeleteVacancyAPIEndPiont,
      body: vacanyData,
    }).then((response) => {
      console.log(response, "delete");
      expect(response).property("status").to.equal(200);
    });
  }
}
