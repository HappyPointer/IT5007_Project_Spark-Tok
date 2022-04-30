// ----------------------------------
// Run this init js file to intialize some test data for the Spark_top project
// During the excution of this script, the database is first emptied, and inserted with 10 inital papers then.
// ----------------------------------
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost/Spark_tok';

async function init_mongodb() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        const papers_collection = db.collection('papers');
        const users_collection = db.collection('users');

        // Empty all existing data
        papers_collection.deleteMany({});
        users_collection.deleteMany({});

        // Initial user data with a pre-defined test data
        users_collection.insertOne({email:"heyingzhi@u.nus.edu", pwd: "123123", total_likes: 1, like_labels:["NLP"], like_numbers:[1]});
        users_collection.createIndex({ email: 1 });

        // Initial paper data with 10 papers from arxiv related to CS
        // For simplity, the labels of these 10 papers are all form ["NLP", "CV", "GNN"]
        const init_papers = [
            {
              title: "UBERT: A Novel Language Model for Synonymy Prediction at Scale in the UMLS Metathesaurus",
              authors:"Thilini Wijesiriwardene, Vinh Nguyen, Goonmeet Bajaj, Hong Yung Yip, Vishesh Javangula, Yuqing Mao, Kin Wah Fung, Srinivasan Parthasarathy, Amit P. Sheth, Olivier Bodenreider",
              abstract: "The UMLS Metathesaurus integrates more than 200 biomedical source vocabularies. During the Metathesaurus construction process, synonymous terms are clustered into concepts by human editors, assisted by lexical similarity algorithms. This process is error-prone and time-consuming. Recently, a deep learning model (LexLM) has been developed for the UMLS Vocabulary Alignment (UVA) task. This work introduces UBERT, a BERT-based language model, pretrained on UMLS terms via a supervised Synonymy Prediction (SP) task replacing the original Next Sentence Prediction (NSP) task. The effectiveness of UBERT for UMLS Metathesaurus construction process is evaluated using the UMLS Vocabulary Alignment (UVA) task. We show that UBERT outperforms the LexLM, as well as biomedical BERT-based models. Key to the performance of UBERT are the synonymy prediction task specifically developed for UBERT, the tight alignment of training data to the UVA task, and the similarity of the models used for pretrained UBERT.",
              labels: ["NLP"]
            },

            {
              title: "Better Query Graph Selection for Knowledge Base Question Answering",
              authors:"Yonghui Jia, Wenliang Chen",
              abstract: "This paper presents a novel approach based on semantic parsing to improve the performance of Knowledge Base Question Answering (KBQA). Specifically, we focus on how to select an optimal query graph from a candidate set so as to retrieve the answer from knowledge base (KB). In our approach, we first propose to linearize the query graph into a sequence, which is used to form a sequence pair with the question. It allows us to use mature sequence modeling, such as BERT, to encode the sequence pair. Then we use a ranking method to sort candidate query graphs. In contrast to the previous studies, our approach can efficiently model semantic interactions between the graph and the question as well as rank the candidate graphs from a global view. The experimental results show that our system achieves the top performance on ComplexQuestions and the second best performance on WebQuestions.",
              labels: ["NLP", "GNN"]
            },

            {
              title: "MILES: Visual BERT Pre-training with Injected Language Semantics for Video-text Retrieval",
              authors:"Yuying Ge, Yixiao Ge, Xihui Liu, Alex Jinpeng Wang, Jianping Wu, Ying Shan, Xiaohu Qie, Ping Luo",
              abstract: "Dominant pre-training work for video-text retrieval mainly adopt the \"dual-encoder\" architectures to enable efficient retrieval, where two separate encoders are used to contrast global video and text representations, but ignore detailed local semantics. The recent success of image BERT pre-training with masked visual modeling that promotes the learning of local visual context, motivates a possible solution to address the above limitation. In this work, we for the first time investigate masked visual modeling in video-text pre-training with the \"dual-encoder\" architecture. We perform Masked visual modeling with Injected LanguagE Semantics (MILES) by employing an extra snapshot video encoder as an evolving \"tokenizer\" to produce reconstruction targets for masked video patch prediction. Given the corrupted video, the video encoder is trained to recover text-aligned features of the masked patches via reasoning with the visible regions along the spatial and temporal dimensions, which enhances the discriminativeness of local visual features and the fine-grained cross-modality alignment. Our method outperforms state-of-the-art methods for text-to-video retrieval on four datasets with both zero-shot and fine-tune evaluation protocols. Our approach also surpasses the baseline models significantly on zero-shot action recognition, which can be cast as video-to-text retrieval.",
              labels: ["NLP", "CV"]
            },

            {
              title: "Approach to Predicting News -- A Precise Multi-LSTM Network With BERT",
              authors:"Chia-Lin Chen, Pei-Yu Huang, Yi-Ting Huang, Chun Lin",
              abstract: "Varieties of Democracy (V-Dem) is a new approach to conceptualizing and measuring democracy and politics. It has information for 200 countries and is one of the biggest databases for political science. According to the V-Dem annual democracy report 2019, Taiwan is one of the two countries that got disseminated false information from foreign governments the most. It also shows that the \"made-up news\" has caused a great deal of confusion in Taiwanese society and has serious impacts on global stability. Although there are several applications helping distinguish the false information, we found out that the pre-processing of categorizing the news is still done by human labor. However, human labor may cause mistakes and cannot work for a long time. The growing demands for automatic machines in the near decades show that while the machine can do as good as humans or even better, using machines can reduce humans' burden and cut down costs. Therefore, in this work, we build a predictive model to classify the category of news. The corpora we used contains 28358 news and 200 news scraped from the online newspaper Liberty Times Net (LTN) website and includes 8 categories: Technology, Entertainment, Fashion, Politics, Sports, International, Finance, and Health. At first, we use Bidirectional Encoder Representations from Transformers (BERT) for word embeddings which transform each Chinese character into a (1,768) vector. Then, we use a Long Short-Term Memory (LSTM) layer to transform word embeddings into sentence embeddings and add another LSTM layer to transform them into document embeddings. Each document embedding is an input for the final predicting model, which contains two Dense layers and one Activation layer. And each document embedding is transformed into 1 vector with 8 real numbers, then the highest one will correspond to the 8 news categories with up to 99% accuracy.",
              labels: ["NLP"]
            },

            {
              title: "Self-Supervised Learning of Object Parts for Semantic Segmentation",
              authors:"Adrian Ziegler, Yuki M. Asano",
              abstract: "Progress in self-supervised learning has brought strong general image representation learning methods. Yet so far, it has mostly focused on image-level learning. In turn, tasks such as unsupervised image segmentation have not benefited from this trend as they require spatially-diverse representations. However, learning dense representations is challenging, as in the unsupervised context it is not clear how to guide the model to learn representations that correspond to various potential object categories. In this paper, we argue that self-supervised learning of object parts is a solution to this issue. Object parts are generalizable: they are a priori independent of an object definition, but can be grouped to form objects a posteriori. To this end, we leverage the recently proposed Vision Transformer's capability of attending to objects and combine it with a spatially dense clustering task for fine-tuning the spatial tokens. Our method surpasses the state-of-the-art on three semantic segmentation benchmarks by 17%-3%, showing that our representations are versatile under various object definitions. Finally, we extend this to fully unsupervised segmentation - which refrains completely from using label information even at test-time - and demonstrate that a simple method for automatically merging discovered object parts based on community detection yields substantial gains.",
              labels: ["CV"]
            },

            {
              title: "3D Magic Mirror: Clothing Reconstruction from a Single Image via a Causal Perspective",
              authors:"Zhedong Zheng, Jiayin Zhu, Wei Ji, Yi Yang, Tat-Seng Chua",
              abstract: "This research aims to study a self-supervised 3D clothing reconstruction method, which recovers the geometry shape, and texture of human clothing from a single 2D image. Compared with existing methods, we observe that three primary challenges remain: (1) the conventional template-based methods are limited to modeling non-rigid clothing objects, e.g., handbags and dresses, which are common in fashion images; (2) 3D ground-truth meshes of clothing are usually inaccessible due to annotation difficulties and time costs. (3) It remains challenging to simultaneously optimize four reconstruction factors, i.e., camera viewpoint, shape, texture, and illumination. The inherent ambiguity compromises the model training, such as the dilemma between a large shape with a remote camera or a small shape with a close camera. In an attempt to address the above limitations, we propose a causality-aware self-supervised learning method to adaptively reconstruct 3D non-rigid objects from 2D images without 3D annotations. In particular, to solve the inherent ambiguity among four implicit variables, i.e., camera position, shape, texture, and illumination, we study existing works and introduce an explainable structural causal map (SCM) to build our model. The proposed model structure follows the spirit of the causal map, which explicitly considers the prior template in the camera estimation and shape prediction. When optimization, the causality intervention tool, i.e., two expectation-maximization loops, is deeply embedded in our algorithm to (1) disentangle four encoders and (2) help the prior template update. Extensive experiments on two 2D fashion benchmarks, e.g., ATR, and Market-HQ, show that the proposed method could yield high-fidelity 3D reconstruction. Furthermore, we also verify the scalability of the proposed method on a fine-grained bird dataset, i.e., CUB.",
              labels: ["CV"]
            },

            {
              title: "Collaborative Learning for Hand and Object Reconstruction with Attention-guided Graph Convolution",
              authors:"Tze Ho Elden Tse, Kwang In Kim, Ales Leonardis, Hyung Jin Chang",
              abstract: "Estimating the pose and shape of hands and objects under interaction finds numerous applications including augmented and virtual reality. Existing approaches for hand and object reconstruction require explicitly defined physical constraints and known objects, which limits its application domains. Our algorithm is agnostic to object models, and it learns the physical rules governing hand-object interaction. This requires automatically inferring the shapes and physical interaction of hands and (potentially unknown) objects. We seek to approach this challenging problem by proposing a collaborative learning strategy where two-branches of deep networks are learning from each other. Specifically, we transfer hand mesh information to the object branch and vice versa for the hand branch. The resulting optimisation (training) problem can be unstable, and we address this via two strategies: (i) attention-guided graph convolution which helps identify and focus on mutual occlusion and (ii) unsupervised associative loss which facilitates the transfer of information between the branches. Experiments using four widely-used benchmarks show that our framework achieves beyond state-of-the-art accuracy in 3D pose estimation, as well as recovers dense 3D hand and object shapes. Each technical component above contributes meaningfully in the ablation study.",
              labels: ["CV", "GNN"]
            },

            {
              title: "High-quality Conversational Systems",
              authors:"Samuel Ackerman, Ateret Anaby-Tavor, Eitan Farchi, Esther Goldbraich, George Kour, Ella Ravinovich, Orna Raz, Saritha Route, Marcel Zalmanovici, Naama Zwerdling",
              abstract: "Conversational systems or chatbots are an example of AI-Infused Applications (AIIA). Chatbots are especially important as they are often the first interaction of clients with a business and are the entry point of a business into the AI (Artificial Intelligence) world. The quality of the chatbot is, therefore, key. However, as is the case in general with AIIAs, it is especially challenging to assess and control the quality of chatbot systems. Beyond the inherent statistical nature of these systems, where occasional failure is acceptable, we identify two major challenges. The first is to release an initial system that is of sufficient quality such that humans will interact with it. The second is to maintain the quality, enhance its capabilities, improve it and make necessary adjustments based on changing user requests or drift. These challenges exist because it is impossible to predict the real distribution of user requests and the natural language they will use to express these requests. Moreover, any empirical distribution of requests is likely to change over time. This may be due to periodicity, changing usage, and drift of topics. We provide a methodology and set of technologies to address these challenges and to provide automated assistance through a human-in-the-loop approach. We notice that it is crucial to connect between the different phases in the lifecycle of the chatbot development and to make sure it provides its expected business value. For example, that it frees human agents to deal with tasks other than answering human users. Our methodology and technologies apply during chatbot training in the pre-production phase, through to chatbot usage in the field in the post-production phase. They implement the `test first' paradigm by assisting in agile design, and support continuous integration through actionable insights.",
              labels: ["NLP"]
            },

            {
              title: "FlowGNN: A Dataflow Architecture for Universal Graph Neural Network Inference via Multi-Queue Streaming",
              authors:"Rishov Sarkar, Stefan Abi-Karam, Yuqi He, Lakshmi Sathidevi, Cong Hao",
              abstract: "Graph neural networks (GNNs) have recently exploded in popularity thanks to their broad applicability to graph-related problems such as quantum chemistry, drug discovery, and high energy physics. However, meeting demand for novel GNN models and fast inference simultaneously is challenging because of the gap between developing efficient accelerators and the rapid creation of new GNN models. Prior art focuses on the acceleration of specific classes of GNNs, such as Graph Convolutional Network (GCN), but lacks the generality to support a wide range of existing or new GNN models. Meanwhile, most work rely on graph pre-processing to exploit data locality, making them unsuitable for real-time applications. To address these limitations, in this work, we propose a generic dataflow architecture for GNN acceleration, named FlowGNN, which can flexibly support the majority of message-passing GNNs. The contributions are three-fold. First, we propose a novel and scalable dataflow architecture, which flexibly supports a wide range of GNN models with message-passing mechanism. The architecture features a configurable dataflow optimized for simultaneous computation of node embedding, edge embedding, and message passing, which is generally applicable to all models. We also propose a rich library of model-specific components. Second, we deliver ultra-fast real-time GNN inference without any graph pre-processing, making it agnostic to dynamically changing graph structures. Third, we verify our architecture on the Xilinx Alveo U50 FPGA board and measure the on-board end-to-end performance. We achieve a speed-up of up to 51-254x against CPU (6226R) and 1.3-477x against GPU (A6000) (with batch sizes 1 through 1024); we also outperform the SOTA GNN accelerator I-GCN by 1.03x and 1.25x across two datasets. Our implementation code and on-board measurement are publicly available on GitHub.",
              labels: ["GNN"]
            },

            {
              title: "LiftPool: Lifting-based Graph Pooling for Hierarchical Graph Representation Learning",
              authors:"Mingxing Xu, Wenrui Dai, Chenglin Li, Junni Zou, Hongkai Xiong",
              abstract: "Graph pooling has been increasingly considered for graph neural networks (GNNs) to facilitate hierarchical graph representation learning. Existing graph pooling methods commonly consist of two stages, i.e., selecting the top-ranked nodes and removing the rest nodes to construct a coarsened graph representation. However, local structural information of the removed nodes would be inevitably dropped in these methods, due to the inherent coupling of nodes (location) and their features (signals). In this paper, we propose an enhanced three-stage method via lifting, named LiftPool, to improve hierarchical graph representation by maximally preserving the local structural information in graph pooling. LiftPool introduces an additional stage of graph lifting before graph coarsening to preserve the local information of the removed nodes and decouple the processes of node removing and feature reduction. Specifically, for each node to be removed, its local information is obtained by subtracting the global information aggregated from its neighboring preserved nodes. Subsequently, this local information is aligned and propagated to the preserved nodes to alleviate information loss in graph coarsening. Furthermore, we demonstrate that the proposed LiftPool is localized and permutation-invariant. The proposed graph lifting structure is general to be integrated with existing downsampling-based graph pooling methods. Evaluations on benchmark graph datasets show that LiftPool substantially outperforms the state-of-the-art graph pooling methods in the task of graph classification.",
              labels: ["GNN"]
            },
        ];

        papers_collection.insertMany(init_papers);
        papers_collection.createIndex({ labels: 1 });

    } catch(err) {
        console.log(err);
    } finally {
        client.close();
    }
}

init_mongodb();