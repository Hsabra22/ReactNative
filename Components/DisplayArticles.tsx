// Components/DisplayArticles.tsx
import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, 
  Linking, Image, ScrollView, TextInput 
} from "react-native";

export const DisplayArticles = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [number, setNumber] = useState("10");

  useEffect(() => {
    setLoading(true);
    fetch(`https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=${number}&apikey=041650f8ea27db4b19e27a0a5fdf3c42`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.log("Fetch error:", err);
        setLoading(false);
      });
  }, [number]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const articles = data?.articles || [];

  const filteredArticles = articles
    .filter(article => 
      article.title?.toLowerCase().includes(title.toLowerCase().trim())
    )
    .filter(article =>
      article.description?.includes(keyword) ||
      article.content?.includes(keyword) ||
      article.title?.includes(keyword) ||
      article.source?.name?.includes(keyword) ||
      article.source?.country?.includes(keyword)
    );

  return (
    <ScrollView style={styles.container}>

      <TextInput 
        style={styles.input}
        value={title} 
        onChangeText={setTitle} 
        placeholder="Filter By Title"
      />
      <TextInput 
        style={styles.input}
        value={keyword} 
        onChangeText={setKeyword} 
        placeholder="Filter By Keyword"
      />
      <TextInput 
        style={styles.input}
        value={number} 
        onChangeText={setNumber} 
        placeholder="Number of articles"
        keyboardType="numeric"
      />

      <Text style={styles.info}>
        {data?.information?.realTimeArticles?.message || "No real-time message"}
      </Text>
      <Text style={styles.total}>Total Articles: {data?.totalArticles || 0}</Text>

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.article}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.link} onPress={() => Linking.openURL(item.url)}>
              Read more
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No articles found</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  info: { fontSize: 16, marginBottom: 5, color: "#333" },
  total: { fontSize: 14, marginBottom: 15, color: "#555" },
  article: { marginBottom: 20, borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 10 },
  image: { width: "100%", height: 180, marginBottom: 10, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  description: { fontSize: 14, marginBottom: 5, color: "#444" },
  link: { fontSize: 14, color: "blue", textDecorationLine: "underline" },
});
