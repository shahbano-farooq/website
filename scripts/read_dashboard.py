import pandas as pd
from pathlib import Path

path = Path(r"C:\Users\shahb\OneDrive\Desktop\Portfolio\Visualization Dashboard Example\An Instructor's Jounrey.xlsx")
xl = pd.ExcelFile(path)
print("Sheets:", xl.sheet_names)
for sheet in xl.sheet_names:
    df = pd.read_excel(path, sheet_name=sheet)
    print(f"\n=== {sheet} ===")
    print("Columns:", list(df.columns))
    print("Shape:", df.shape)
    print(df.head(10).to_string())
