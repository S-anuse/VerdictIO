--
-- PostgreSQL database dump
--

\restrict IO1ql0WcXF9RQ0XtbFjZKzwnMwkoV8YhJ015ETFBYYyoDFzfFI2OjyZMXQjoCo3

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-19 20:58:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16409)
-- Name: problems; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.problems (
    id integer NOT NULL,
    title character varying(500),
    description text,
    difficulty character varying(10),
    problem_constraints text,
    hints text,
    discussion text,
    solution text,
    created_by integer,
    time_limit integer,
    memory_limit integer
);


ALTER TABLE public.problems OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16408)
-- Name: problems_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.problems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.problems_id_seq OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 221
-- Name: problems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.problems_id_seq OWNED BY public.problems.id;


--
-- TOC entry 226 (class 1259 OID 16452)
-- Name: submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    user_id integer,
    problem_id integer,
    language character varying(20),
    source_code text,
    status character varying(30),
    execution_time integer,
    memory_used integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.submissions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16451)
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submissions_id_seq OWNER TO postgres;

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 225
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- TOC entry 224 (class 1259 OID 16424)
-- Name: test_cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_cases (
    id integer NOT NULL,
    problem_id integer,
    question_input text,
    expected_output text,
    is_hidden boolean
);


ALTER TABLE public.test_cases OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16423)
-- Name: test_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.test_cases_id_seq OWNER TO postgres;

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 223
-- Name: test_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_cases_id_seq OWNED BY public.test_cases.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4873 (class 2604 OID 16412)
-- Name: problems id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.problems ALTER COLUMN id SET DEFAULT nextval('public.problems_id_seq'::regclass);


--
-- TOC entry 4875 (class 2604 OID 16455)
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 16427)
-- Name: test_cases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_cases ALTER COLUMN id SET DEFAULT nextval('public.test_cases_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5041 (class 0 OID 16409)
-- Dependencies: 222
-- Data for Name: problems; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.problems (id, title, description, difficulty, problem_constraints, hints, discussion, solution, created_by, time_limit, memory_limit) FROM stdin;
1	Multiply Two Numbers	Given two integers, return their product.	Easy	1 <= a,b <= 1000	\N	\N	\N	2	2	256
\.


--
-- TOC entry 5045 (class 0 OID 16452)
-- Dependencies: 226
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submissions (id, user_id, problem_id, language, source_code, status, execution_time, memory_used, created_at) FROM stdin;
1	1	1	cpp	#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 3 * 2 ;\n    return 0;\n}	Wrong Answer	\N	\N	2026-07-18 13:08:28.117465
2	1	1	cpp	#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << 3 * 2 ;\n    return 0;\n}	Wrong Answer	\N	\N	2026-07-18 13:09:13.846891
\.


--
-- TOC entry 5043 (class 0 OID 16424)
-- Dependencies: 224
-- Data for Name: test_cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_cases (id, problem_id, question_input, expected_output, is_hidden) FROM stdin;
1	1	2 3	6	f
2	1	5 7	35	t
3	1	10 20	200	t
4	1	15 20	300	t
5	1	25 40	1000	t
\.


--
-- TOC entry 5039 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role) FROM stdin;
2	Sanjeevani1	sanjeevani1@example.com	$2b$10$IRDHM.oDQhGSI98UE/3U5Oa0enbndJW6UVYqrCwlDcSGiopP9S5S2	admin
1	Sanjeevani	sanjeevanianuse@gmail.com	$2b$10$dKwxRkr6BKJRKA4/a.cnDuDFn48g.6qmfatf7YIIFDKsPBwtslpYa	user
\.


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 221
-- Name: problems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.problems_id_seq', 1, true);


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 225
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.submissions_id_seq', 2, true);


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 223
-- Name: test_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_cases_id_seq', 5, true);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4882 (class 2606 OID 16417)
-- Name: problems problems_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.problems
    ADD CONSTRAINT problems_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 16461)
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4884 (class 2606 OID 16432)
-- Name: test_cases test_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 16403)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4880 (class 2606 OID 16401)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 16418)
-- Name: problems problems_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.problems
    ADD CONSTRAINT problems_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4889 (class 2606 OID 16467)
-- Name: submissions submissions_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- TOC entry 4890 (class 2606 OID 16462)
-- Name: submissions submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4888 (class 2606 OID 16433)
-- Name: test_cases test_cases_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problems(id);


-- Completed on 2026-07-19 20:58:56

--
-- PostgreSQL database dump complete
--

\unrestrict IO1ql0WcXF9RQ0XtbFjZKzwnMwkoV8YhJ015ETFBYYyoDFzfFI2OjyZMXQjoCo3

