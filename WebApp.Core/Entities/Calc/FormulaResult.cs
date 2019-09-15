using System.Collections.Generic;

namespace WebApp.Core.Entities.Calc
{
    public class FormulaResult
    {
        public bool IsValid { get; set; }

        public string Result { get; set; }

        public string Error { get; set; }

        public List<ParameterFormula> Parameters { get; set; }
    }
}
