# Crusheet API
Each command is shown for both PowerShell and Git Bash

---

## Endpoints

URL: https://crusheet-api.vercel.app

| Method | Path | Purpose |
| :--- | :--- | :--- |
| GET | / | API name and other endpoints |
| GET | /api/health | Status check |
| GET | /api/units | Lists all units |
| GET | /api/units/{id} | Gets specific unit by id |
| POST | /api/units | Need login, creates a unit |
| PATCH | /api/units/{id} | Need login, changes fields of a unit |
| PATCH | /api/units/{id}/wargear/{index} | Need login, changes fields of a wargear |
| PATCH | /api/units/{id}/abilities/{index} | Need login, changes fields of an ability |
| DELETE | /api/units/{id} | Need login, deletes a unit |

---

## Examples of endpoint usage

<details>
  <summary>Login Token</summary>

  ### Getting a login token
  
- Tokens expire after about an hour and are not required for GET.
  
  **PowerShell**
  
  ```powershell
  $SUPABASE_URL = "https://URL.supabase.co"
  $SUPABASE_KEY = "PUBLISHABLE-KEY"
  $API = "https://crusheet-api.vercel.app"
  
  $login = Invoke-RestMethod -Method Post `
    -Uri "$SUPABASE_URL/auth/v1/token?grant_type=password" `
    -Headers @{ apikey = $SUPABASE_KEY } `
    -ContentType "application/json" `
    -Body (@{ email = "you@example.com"; password = "your-password" } | ConvertTo-Json)
  
  $AUTH = @{ Authorization = "Bearer $($login.access_token)" }
  ```
  
  **Git Bash**
  
  ```sh
  SUPABASE_URL="https://URL.supabase.co"
  SUPABASE_KEY="PUBLISHABLE-KEY"
  API="https://crusheet-api.vercel.app"
  
  TOKEN=$(curl -s "$SUPABASE_URL/auth/v1/token?grant_type=password" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Content-Type: application/json" \
    -d '{"email":"you@example.com","password":"your-password"}' \
    | sed -E 's/.*"access_token":"([^"]+)".*/\1/')
  
  echo "$TOKEN"   # should be a long eyJ... string, not an error message
  ```
</details>

<details>
  <summary>Create a unit</summary>

  ### Required and optional fields
  
- **Required:** `name`, `movement` (0 or more), `toughness`, `save`, `wounds`<br>
- **Optional:** `invuln_save` (integer or `null`), `wargear`, `abilities`
  
  **PowerShell**
  ```powershell
  $newUnit = @{
    name        = "Banesword"
    movement    = 12
    toughness   = 13
    save        = 2
    invuln_save = $null
    wounds      = 24
    wargear     = @(
      @{ Name = "Quake Cannon"; Abilities = @("Blast", "Ignores Cover"); Range = 48; A = 1; BS = 4; S = 12; AP = "-3"; D = "D6+1" },
      @{ Name = "Armoured Tracks"; Abilities = $null; Range = "Melee"; A = 6; BS = 4; S = 8; AP = 0; D = 1 }
    )
    abilities   = @( @{ Desc = "Deadly Demise" } )
  }
  
  $created = Invoke-RestMethod -Method Post -Uri "$API/api/units" -Headers $AUTH `
    -ContentType "application/json" -Body ($newUnit | ConvertTo-Json -Depth 5)
  
  $created
  $ID = $created.id
  ```
  
  **Git Bash**
  ```sh
  curl -i -X POST "$API/api/units" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Banesword",
      "movement": 12, "toughness": 13, "save": 2, "invuln_save": null, "wounds": 24,
      "wargear": [
        { "Name": "Quake Cannon", "Abilities": ["Blast", "Ignores Cover"], "Range": 48, "A": 1, "BS": 4, "S": 12, "AP": "-3", "D": "D6+1" },
        { "Name": "Armoured Tracks", "Abilities": null, "Range": "Melee", "A": 6, "BS": 4, "S": 8, "AP": 0, "D": 1 }
      ],
      "abilities": [{ "Desc": "Deadly Demise" }]
    }'
  ```
</details>

<details>
  <summary>Get a unit</summary>

  ### All units
  
  **PowerShell**
  ```powershell
  Invoke-RestMethod "$API/api/units"
  ```

  **Git Bash**
  ```sh
  curl "$API/api/units"
  ```

  ### One Unit

  **PowerShell**
  ```powershell
  Invoke-RestMethod "$API/api/units/$ID"
  ```

  **Git Bash**
  ```sh
  curl "$API/api/units/$ID"
  ```
</details>

<details>
  <summary>Edit a unit</summary>

### Editing specific fields in a unit

- **Weapons** accept :
  - `Name` : String
  - `Abilities` : String[], null
  - `Range` : Integer, "Melee"
  - `A` : Integer, String
  - `BS` : Integer
  - `S` : Integer
  - `AP` : Integer, String
  - `D` : Integer, String
- **Abilities** only accept `Desc`
- An entry can't change type this way. To turn a note into a weapon, PATCH the whole `wargear` list.
- Send **only the fields you want to change**. Everything else stays as it was.
- Run a GET on the unit first to see the order
- To add or remove a weapon, send the full new list.

  **PowerShell**
  ```powershell
  Invoke-RestMethod -Method Patch -Uri "$API/api/units/$ID" -Headers $AUTH `
    -ContentType "application/json" -Body (@{ wounds = 3; invuln_save = 5 } | ConvertTo-Json)
  ```

  **Git Bash**
  ```sh
  curl -i -X PATCH "$API/api/units/$ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{ "wounds": 3, "invuln_save": 5 }'
  ```

- Check the index of the weapon/ability
  ```
  PATCH /api/units/:id/wargear/:index
  PATCH /api/units/:id/abilities/:index
  ```

> Example: change the first weapon's Range from 48 to 13.

**PowerShell**
```powershell
Invoke-RestMethod -Method Patch -Uri "$API/api/units/$ID/wargear/0" -Headers $AUTH `
  -ContentType "application/json" -Body (@{ Range = 13 } | ConvertTo-Json)
```

**Git Bash**
```sh
curl -i -X PATCH "$API/api/units/$ID/wargear/0" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "Range": 13 }'
```

> Example: change the ability

**PowerShell**
```powershell
Invoke-RestMethod -Method Patch -Uri "$API/api/units/$ID/abilities/0" -Headers $AUTH `
  -ContentType "application/json" -Body (@{ Desc = "Deep Strike" } | ConvertTo-Json)
```

**Git Bash**
```sh
curl -i -X PATCH "$API/api/units/$ID/abilities/0" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "Desc": "Deep Strike" }'
```

</details>

<details>
  <summary>Delete a unit</summary>

  ### You are only able to delete units that you own

  **PowerShell**
  ```powershell
  Invoke-RestMethod -Method Delete -Uri "$API/api/units/$ID" -Headers $AUTH
  ```
  
  **Git Bash**
  ```sh
  curl -i -X DELETE "$API/api/units/$ID" -H "Authorization: Bearer $TOKEN"
  ```
</details>

---

## Common issues

| Status | Message | Fix |
| --- | --- | --- |
| 400 | `name is required`, `wounds must be...` | The body failed a check. The message names the field. |
| 400 | `The request body is not valid JSON` | In PowerShell, use `ConvertTo-Json` rather than typing JSON by hand, or there was a formatting error. |
| 400 | `These fields cannot be changed: ...` | PATCH got `id`, `user_id` or a misspelled field. |
| 401 | `Log in first` | The `Authorization: Bearer ...` header is missing. |
| 401 | `Invalid or expired token` | Get a new token. |
| 400 | `wargear[0] is a note, so only Desc...` | PATCH the whole list instead. |
| 404 | `Unit not found` / `No unit with id ...` | Wrong id, or the unit isn't yours. |
| 404 | `Unit 12 has no wargear entry 3` | The index is past the end of the list. Indexes start at 0, GET the unit to check the index. |
| 404 | `Nothing at PATCH /api/units/...` | The live API isn't updated. |
| 500 | `Login needs Supabase...` | Add `SUPABASE_URL` and `SUPABASE_SECRET_KEY` locally in `crusheet-api/.env` and restart. |

**Seeing error bodies in PowerShell 5.1:** `Invoke-RestMethod` throws on 4xx/5xx and hides the JSON. Either use `curl.exe -i ...`, or catch the error:

```powershell
try { Invoke-RestMethod ... } catch { $_.ErrorDetails.Message }
```
