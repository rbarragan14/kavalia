namespace WebApp.Infrastructure.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    using global::NCalc;

    using WebApp.Core.Entities.Calc;
    using WebApp.Infrastructure.Services.NCalc;

    public class FormulaService
    {
        private List<string> systemWildcards = new List<string>
                                                   {
                                                       "ANOSIS",
                                                       "MESSIS",
                                                       "DIASIS",
                                                       "BISIS",
                                                       "TRISIS",
                                                       "SEMSIS",
                                                       "MESINIFIS",
                                                       "MESFINFIS",
                                                       "INFINITO",
                                                       "NULO"
                                                   };

        public async Task<FormulaResult> CheckFormulaAsync(Formula formula)
        {
            return await Task.Factory.StartNew<FormulaResult>(() => this.GetFormulaResult(formula, false));
        }

        public async Task<FormulaResult> EvaluateFormulaAsync(Formula formula)
        {
            return await Task.Factory.StartNew<FormulaResult>(() => this.GetFormulaResult(formula, true));
        }

        private Expression CreateExpression(Formula formula)
        {
            var expression = new Expression(formula.Body);
            if (formula.Parameters != null)
            {
                foreach (var item in formula.Parameters)
                {
                    expression.Parameters.Add(item.Name, item.Value);
                }
            }

            return expression;
        }

        private FormulaResult GetFormulaResult(Formula formula, bool evaluate)
        {
            var e = this.CreateExpression(formula);
            var formulaResult = new FormulaResult();
            formulaResult.IsValid = !e.HasErrors();

            if (!formulaResult.IsValid)
            {
                formulaResult.Error = this.FormatSyntaxError(e.Error);
            }
            else
            {
                var parametersFormula = new List<string>();
                parametersFormula.AddRange(this.systemWildcards);
                if (formula.Parameters != null)
                {
                    parametersFormula.AddRange(formula.Parameters.Select(x => x.Name));
                }

                formulaResult.Parameters = this.ExtractParameters(formula);
                var missingParameters = formulaResult.Parameters.Where(
                        p => parametersFormula.All(x => !x.Equals(p.Name, StringComparison.InvariantCultureIgnoreCase)))
                    .ToArray();

                if (missingParameters.Length > 0)
                {
                    formulaResult.IsValid = false;
                    var sb = new StringBuilder();
                    foreach (var missingParameter in missingParameters)
                    {
                        sb.AppendLine($"Parametro no encontrado {missingParameter.Name}");
                    }

                    formulaResult.Error = sb.ToString();
                }
                else if (evaluate)
                {
                    formulaResult.Result = e.Evaluate()?.ToString() ?? null;
                }
            }

            return formulaResult;
        }

        public List<ParameterFormula> ExtractParameters(Formula formula)
        {
            var expression = global::NCalc.Expression.Compile(formula.Body, false);
            var visitor = new ParameterExtractionVisitor();
            expression.Accept(visitor);
            return visitor.Parameters.Select(x => new ParameterFormula { Name = x }).ToList();
        }

        private string FormatSyntaxError(string errors)
        {
            return "Error de sintaxis";
        }
    }
}
