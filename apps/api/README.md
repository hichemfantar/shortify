# **📜 URL Shortener API Documentation**

## **Usage Example**

### 🔹 **Shorten a URL**

```sh
curl -X POST "http://localhost:3000/shorten" \
     -H "Content-Type: application/json" \
     -d '{"longUrl": "https://example.com"}'
```

### 🔹 **Redirect to Original URL**

```sh
curl -L "http://localhost:3000/abc123"
```

## **Base URL**  

```
http://localhost:3000
```

---

## **1️⃣ Shorten a URL**

### **POST `/shorten`**  

Generates a **shortened URL** from a given long URL.

### **Request**

#### 🔹 **Headers**

```json
Content-Type: application/json
```

#### 🔹 **Body Parameters**

```json
{
  "longUrl": "https://example.com/some-very-long-url"
}
```

### **Response**

#### ✅ **200 OK**

```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

#### ❌ **400 Bad Request**

```json
{
  "error": "URL is required"
}
```

---

## **2️⃣ Redirect to Original URL**

### **GET `/{shortId}`**  

Redirects the user to the **original URL** associated with the short ID.

### **Request**

#### 🔹 **Path Parameter**

| Parameter | Type   | Required | Description           |
| --------- | ------ | -------- | --------------------- |
| `shortId` | String | ✅ Yes    | The shortened URL ID. |

#### 🔹 **Example Request**

```
GET http://localhost:3000/abc123
```

### **Response**

#### ✅ **302 Found** (Redirects to the original URL)

#### ❌ **404 Not Found**

```json
{
  "error": "Not found"
}
```
